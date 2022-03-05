import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createOvertimeService from './createOvertimeService';
import createTimerService from './createTimerService';
import {
  AppState,
  OvertimeState,
  PomelloEvent,
  PomelloEventMap,
  PomelloServiceConfig,
  PomelloSettings,
  PomelloState,
  TaskTimerEndPromptHandledAction,
  Timer,
  TimerState,
  TimerType,
} from './models';
import timerMarker from './timerMarker';

const createPomelloService = ({
  createTicker,
  settings: initialSettings,
}: PomelloServiceConfig) => {
  let settings = initialSettings;

  const { batchedEmit, emit, on, off } = createEventEmitter<PomelloEventMap>();

  const taskTimerMarker = timerMarker();

  const handleOvertimeStart = (): void => {
    emit('overtimeStart', createPomelloEvent());
  };

  const handleOvertimeTick = (): void => {
    emit('overtimeTick', createPomelloEvent());
  };

  const handleTimerEnd = (timer: Timer): void => {
    // To avoid showning the time of 0, handleTimerEnd gets fired when the timer
    // gets ticked at 1. The actual time is 0 but it's not shown for aesthetic
    // reasons. So we need to hardcode the time to 0 here.
    const adjustedTimer = { time: 0, totalTime: timer.totalTime, type: timer.type };

    emit('timerEnd', createPomelloEvent({ timer: adjustedTimer }));

    // Injected timers aren't part of the set, so don't increment the index.
    if (!timer.isInjected) {
      incrementSetIndex();
    }

    if (appService.getState().value === AppState.task) {
      taskTimerMarker.unsetMarker();

      appService.setAppState(AppState.taskTimerEndPrompt);

      emit('taskEnd', createPomelloEvent({ timer: adjustedTimer }));
    } else if (appService.getState().value !== AppState.taskCompletePrompt) {
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
    onOvertimeStart: handleOvertimeStart,
    onOvertimeTick: handleOvertimeTick,
    onStateChange: handleServiceUpdate,
    ticker: createTicker(),
  });

  let setIndex = 0;

  const createPomelloEvent = (eventOverrides: Partial<PomelloEvent> = {}): PomelloEvent => {
    const timer = timerService.getState().context.timer;

    return {
      taskId: appService.getState().context.currentTaskId,
      timer: timer
        ? {
            time: timer.time,
            totalTime: timer.totalTime,
            type: timer.type,
          }
        : null,
      overtime: overtimeService.getState().context.overtime,
      timestamp: Date.now(),
      ...eventOverrides,
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
        } else {
          // The timer already exists, so we're starting a new task
          const { timer } = timerService.getState().context;
          const previousTaskMarker = taskTimerMarker.getMarker(settings.betweenTasksGracePeriod);

          let eventOverrides = {};
          if (timer && previousTaskMarker) {
            eventOverrides = {
              timer: {
                time: previousTaskMarker.time,
                totalTime: timer.totalTime,
                type: timer.type,
              },
              timestamp: previousTaskMarker.timestamp,
            };
          }

          emit('taskStart', createPomelloEvent(eventOverrides));
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
    taskTimerMarker.setMarker(timerService.getState().context.timer);

    appService.completeTask();
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
    const overtime = overtimeService.getState();
    if (overtime.value === OvertimeState.active) {
      emit('overtimeEnd', createPomelloEvent());
    }

    overtimeService.endOvertime();

    const timerState = timerService.getState();
    const wasPaused = timerState.value === TimerState.paused;
    const isTaskTimer = timerState.context.timer?.type === TimerType.task;

    if (wasPaused) {
      emit('timerResume', createPomelloEvent());
    } else {
      emit('timerStart', createPomelloEvent());

      if (isTaskTimer) {
        emit('taskStart', createPomelloEvent());
      }
    }

    timerService.startTimer();
  };

  const switchTask = (): void => {
    emit('taskEnd', createPomelloEvent());

    taskTimerMarker.setMarker(timerService.getState().context.timer);

    appService.switchTask();
  };

  const taskCompleteHandled = (): void => {
    appService.unsetCurrentTask();

    transitionPomodoroState();
  };

  const taskTimerEndPromptHandled = (action: TaskTimerEndPromptHandledAction): void => {
    if (action === 'voidTask') {
      decrementSetIndex();

      return voidTask();
    }

    if (action === 'switchTask') {
      appService.unsetCurrentTask();
    }

    transitionPomodoroState();

    startTimer();
  };

  const updateSettings = (updatedSettings: PomelloSettings): void => {
    settings = updatedSettings;
  };

  const voidTask = (): void => {
    emit('taskVoid', createPomelloEvent());

    if (timerService.getState().value === TimerState.active) {
      timerService.destroyTimer();
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
    getState,
    off,
    on,
    pauseTimer,
    selectTask,
    setReady,
    skipTimer,
    startTimer,
    switchTask,
    taskCompleteHandled,
    taskTimerEndPromptHandled,
    updateSettings,
    voidPromptHandled,
    voidTask,
  };
};

export default createPomelloService;
