import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createTimerService from './createTimerService';
import {
  AppState,
  PomelloEventMap,
  PomelloServiceConfig,
  PomelloState,
  PomelloStateValue,
  TimerState,
  TimerType,
} from './models';

const createPomelloService = ({ createTicker, settings }: PomelloServiceConfig) => {
  const { emit, on, off } = createEventEmitter<PomelloEventMap>();

  const appService = createAppService({
    onStateChange: handleServiceUpdate,
  });

  const timerService = createTimerService({
    onStateChange: handleServiceUpdate,
    onTimerEnd: handleTimerEnd,
    onTimerTick: handleTimerTick,
    ticker: createTicker(),
  });

  const setIndex = 0;

  function handleTimerEnd(): void {
    appService.handleTimerEnd();

    emit('timerEnd', getState());
  }

  function handleTimerTick(): void {
    emit('timerTick', getState());
  }

  function handleServiceUpdate(): void {
    emit('update', getState());
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

        return appService.transitionPomodoroState(AppState.task);
      } else {
        return appService.transitionPomodoroState(AppState.selectTask);
      }
    }

    if (set === 'shortBreak') {
      return appService.transitionPomodoroState(AppState.shortBreak);
    }

    if (set === 'longBreak') {
      return appService.transitionPomodoroState(AppState.longBreak);
    }

    throw new Error(`Unknown set item: "${set}"`);
  }

  function pauseTimer(): void {
    timerService.pauseTimer();

    emit('timerPause', getState());
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

  function startTimer(): void {
    const wasPaused = timerService.getState().value === TimerState.paused;

    timerService.startTimer();

    if (wasPaused) {
      emit('timerResume', getState());
    } else {
      emit('timerStart', getState());
    }
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
      value: appState.value as unknown as PomelloStateValue,
      currentTaskId: appState.context.currentTaskId,
      timer,
    };
  }

  return {
    pauseTimer,
    selectTask,
    setReady,
    startTimer,
    getState,
    on,
    off,
  };
};

export default createPomelloService;
