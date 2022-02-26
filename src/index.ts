import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createTimerService from './createTimerService';
import {
  AppState,
  PomelloEventMap,
  PomelloServiceConfig,
  PomelloState,
  Timer,
  TimerState,
  TimerType,
} from './models';

const createPomelloService = ({ createTicker, settings }: PomelloServiceConfig) => {
  const { batchedEmit, emit, on, off } = createEventEmitter<PomelloEventMap>();

  const appService = createAppService({
    onStateChange: handleServiceUpdate,
  });

  const timerService = createTimerService({
    onStateChange: handleServiceUpdate,
    onTimerEnd: handleTimerEnd,
    onTimerTick: handleTimerTick,
    ticker: createTicker(),
  });

  let setIndex = 0;

  function handleTimerEnd(timer: Timer): void {
    // Injected timers aren't part of the set, so don't increment the index.
    if (!timer.isInjected) {
      incrementSetIndex();
    }

    if (appService.getState().value === AppState.task) {
      appService.setAppState(AppState.taskTimerEndPrompt);
    } else {
      transitionPomodoroState();
    }

    emit('timerEnd', getState());
  }

  function handleTimerTick(): void {
    emit('timerTick', getState());
  }

  function handleServiceUpdate(): void {
    batchedEmit('update', getState());
  }

  function decrementSetIndex(): void {
    setIndex -= 1;

    if (setIndex < 0) {
      setIndex = settings.set.length - 1;
    }
  }

  function incrementSetIndex(): void {
    setIndex += 1;

    if (setIndex >= settings.set.length) {
      setIndex = 0;
    }
  }

  function transitionPomodoroState(): void {
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
  }

  function completeTask(): void {
    appService.completeTask();
  }

  function continueTask(): void {
    transitionPomodoroState();

    startTimer();
  }

  function getState(): PomelloState {
    const appState = appService.getState();
    const timerState = timerService.getState();

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
    };
  }

  function pauseTimer(): void {
    timerService.pauseTimer();

    emit('timerPause', getState());
  }

  function selectNewTask(): void {
    appService.unsetCurrentTask();

    transitionPomodoroState();

    startTimer();
  }

  function selectTask(taskId: string): void {
    appService.selectTask(taskId);

    transitionPomodoroState();

    emit('taskSelect', getState());
  }

  function setReady(): void {
    transitionPomodoroState();

    emit('appInitialize', getState());
  }

  function skipTimer(): void {
    emit('timerSkip', getState());

    timerService.destroyTimer();

    incrementSetIndex();

    transitionPomodoroState();
  }

  function startTimer(): void {
    const wasPaused = timerService.getState().value === TimerState.paused;

    timerService.startTimer();

    if (wasPaused) {
      emit('timerResume', getState());
    } else {
      emit('timerStart', getState());
    }
  }

  function switchTask(): void {
    appService.switchTask();
  }

  function taskCompleteHandled(): void {
    appService.unsetCurrentTask();

    transitionPomodoroState();
  }

  function voidTask(): void {
    emit('taskVoid', getState());

    if (timerService.getState().value === TimerState.active) {
      timerService.destroyTimer();
    }

    if (appService.getState().value === AppState.taskTimerEndPrompt) {
      decrementSetIndex();
    }

    appService.voidTask();
  }

  function voidPromptHandled(): void {
    appService.setAppState(AppState.shortBreak);

    timerService.createTimer({
      isInjected: true,
      time: settings.shortBreakTime,
      type: TimerType.shortBreak,
    });

    startTimer();
  }

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
