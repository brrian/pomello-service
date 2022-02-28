import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createOvertimeService from './createOvertimeService';
import createTimerService from './createTimerService';
import {
  AppState,
  PomelloEvent,
  PomelloEventMap,
  PomelloServiceConfig,
  PomelloState,
  Timer,
  TimerState,
  TimerType,
} from './models';

const createPomelloService = ({ createTicker, settings }: PomelloServiceConfig) => {
  const { batchedEmit, emit, on, off } = createEventEmitter<PomelloEventMap>();

  const handleTimerEnd = (timer: Timer): void => {
    // To avoid showning the time of 0, handleTimerEnd gets fired when the timer
    // gets ticked at 1. The actual time is 0 but it's not shown for aesthetic
    // reasons. So we need to hardcode the time to 0 here.
    emit('timerEnd', createPomelloEvent({ ...timer, time: 0 }));

    // Injected timers aren't part of the set, so don't increment the index.
    if (!timer.isInjected) {
      incrementSetIndex();
    }

    if (appService.getState().value === AppState.task) {
      appService.setAppState(AppState.taskTimerEndPrompt);
    } else {
      transitionPomodoroState();
    }

    overtimeService.startOvertimeCountdown({
      delay: settings.overtimeDelay,
      type: timer.type,
    });
  };

  const handleTimerTick = (): void => {
    emit('timerTick', createPomelloEvent());
  };

  const handleServiceUpdate = (): void => {
    batchedEmit('update', getState());
  };

  const appService = createAppService({
    onStateChange: handleServiceUpdate,
  });

  const timerService = createTimerService({
    onStateChange: handleServiceUpdate,
    onTimerEnd: handleTimerEnd,
    onTimerTick: handleTimerTick,
    ticker: createTicker(),
  });

  const overtimeService = createOvertimeService({
    onStateChange: handleServiceUpdate,
    ticker: createTicker(),
  });

  let setIndex = 0;

  const createPomelloEvent = (timerOverride?: Timer): PomelloEvent => {
    const timer = timerOverride ? timerOverride : timerService.getState().context.timer;

    return {
      taskId: appService.getState().context.currentTaskId,
      timer: timer
        ? {
            time: timer.time,
            totalTime: timer.totalTime,
            type: timer.type,
          }
        : null,
      timestamp: Date.now(),
    };
  };

  const decrementSetIndex = (): void => {
    setIndex -= 1;

    if (setIndex < 0) {
      setIndex = settings.set.length - 1;
    }
  };

  const incrementSetIndex = (): void => {
    setIndex += 1;

    if (setIndex >= settings.set.length) {
      setIndex = 0;
    }
  };

  const transitionPomodoroState = (): void => {
    const set = settings.set[setIndex];

    if (set === 'task') {
      if (appService.getState().context.currentTaskId) {
        if (!timerService.getState().context.timer) {
          timerService.createTimer({
            time: settings.taskTime,
            type: TimerType.task,
          });
        }

        return appService.setAppState(AppState.task);
      } else {
        return appService.setAppState(AppState.selectTask);
      }
    }

    if (set === 'shortBreak') {
      timerService.createTimer({
        time: settings.shortBreakTime,
        type: TimerType.shortBreak,
      });

      return appService.setAppState(AppState.shortBreak);
    }

    if (set === 'longBreak') {
      timerService.createTimer({
        time: settings.longBreakTime,
        type: TimerType.longBreak,
      });

      return appService.setAppState(AppState.longBreak);
    }

    throw new Error(`Unknown set item: "${set}"`);
  };

  const completeTask = (): void => {
    appService.completeTask();
  };

  const continueTask = (): void => {
    transitionPomodoroState();

    startTimer();
  };

  const getState = (): PomelloState => {
    const appState = appService.getState();
    const timerState = timerService.getState();
    const overtime = overtimeService.getState();

    const timer = timerState.context.timer
      ? {
          isActive: timerState.value === TimerState.active,
          isInjected: timerState.context.timer.isInjected,
          isPaused: timerState.value === TimerState.paused,
          time: timerState.context.timer.time,
          totalTime: timerState.context.timer.totalTime,
          type: timerState.context.timer.type,
        }
      : null;

    return {
      value: appState.value,
      currentTaskId: appState.context.currentTaskId,
      timer,
      overtime: overtime.context.overtime,
    };
  };

  const pauseTimer = (): void => {
    timerService.pauseTimer();

    emit('timerPause', createPomelloEvent());
  };

  const selectNewTask = (): void => {
    appService.unsetCurrentTask();

    transitionPomodoroState();

    startTimer();
  };

  const selectTask = (taskId: string): void => {
    appService.selectTask(taskId);

    transitionPomodoroState();

    emit('taskSelect', createPomelloEvent());
  };

  const setReady = (): void => {
    transitionPomodoroState();

    emit('appInitialize', createPomelloEvent());
  };

  const skipTimer = (): void => {
    emit('timerSkip', createPomelloEvent());

    timerService.destroyTimer();

    incrementSetIndex();

    transitionPomodoroState();
  };

  const startTimer = (): void => {
    overtimeService.endOvertime();

    const wasPaused = timerService.getState().value === TimerState.paused;
    if (wasPaused) {
      emit('timerResume', createPomelloEvent());
    } else {
      emit('timerStart', createPomelloEvent());
    }

    timerService.startTimer();
  };

  const switchTask = (): void => {
    appService.switchTask();
  };

  const taskCompleteHandled = (): void => {
    appService.unsetCurrentTask();

    transitionPomodoroState();
  };

  const voidTask = (): void => {
    emit('taskVoid', createPomelloEvent());

    if (timerService.getState().value === TimerState.active) {
      timerService.destroyTimer();
    }

    if (appService.getState().value === AppState.taskTimerEndPrompt) {
      decrementSetIndex();
    }

    appService.voidTask();
  };

  const voidPromptHandled = (): void => {
    appService.setAppState(AppState.shortBreak);

    timerService.createTimer({
      isInjected: true,
      time: settings.shortBreakTime,
      type: TimerType.shortBreak,
    });

    startTimer();
  };

  return {
    completeTask,
    continueTask,
    getState,
    off,
    on,
    pauseTimer,
    selectNewTask,
    selectTask,
    setReady,
    skipTimer,
    startTimer,
    switchTask,
    taskCompleteHandled,
    voidTask,
    voidPromptHandled,
  };
};

export default createPomelloService;
