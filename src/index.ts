import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createTimerService from './createTimerService';
import {
  AppState,
  PomelloEventMap,
  PomelloServiceConfig,
  PomelloState,
  PomelloStateValue,
  TimerStateValue,
  TimerTransitionEvent,
  TimerType,
} from './models';

const createPomelloService = ({ createTicker, settings }: PomelloServiceConfig) => {
  const { emit, on, off } = createEventEmitter<PomelloEventMap>();

  const timerTicker = createTicker();

  const appService = createAppService({
    onStateChange: handleServiceUpdate,
  });
  const timerService = createTimerService();

  const setIndex = 0;

  const handleTimerTransition = ({ state, prevState }: TimerTransitionEvent): void => {
    if (state.value === TimerStateValue.active) {
      if (prevState.value === TimerStateValue.ready) {
        emit('timerStart', getState());
      } else if (prevState.value === TimerStateValue.paused) {
        emit('timerResume', getState());
      }

      timerTicker.start(() => {
        timerService.tickTimer();

        emit('timerTick', getState());
      });
    } else if (state.value === TimerStateValue.idle) {
      timerTicker.stop();

      appService.handleTimerEnd();

      emit('timerEnd', getState());
    } else if (state.value === TimerStateValue.paused) {
      timerTicker.stop();

      emit('timerPause', getState());
    }
  };

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
    timerService.startTimer();
  }

  function getState(): PomelloState {
    const appState = appService.getState();
    const timerState = timerService.getState();

    const timer = timerState.context.timer
      ? {
          isActive: timerState.value === TimerStateValue.active,
          isInjected: timerState.context.timer.isInjected,
          isPaused: timerState.value === TimerStateValue.paused,
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

  timerService.on('transition', handleTimerTransition);
  timerService.on('update', handleServiceUpdate);

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
