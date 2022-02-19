import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createTimerService from './createTimerService';
import {
  AppState,
  AppStateValue,
  PomelloEventMap,
  PomelloServiceConfig,
  PomelloState,
  TimerStateValue,
  TimerTransitionEvent,
  TimerType,
} from './models';

const createPomelloService = ({ createTicker, settings }: PomelloServiceConfig) => {
  const { emit, on, off } = createEventEmitter<PomelloEventMap>();

  const timerTicker = createTicker();

  const appService = createAppService();
  const timerService = createTimerService();

  const handleAppTransition = (state: AppState): void => {
    if (state.value === AppStateValue.selectTask) {
      emit('appInitialize', getState());
    } else if (state.value === AppStateValue.task) {
      timerService.createTimer({
        time: settings.taskTime,
        type: TimerType.task,
      });

      emit('taskSelect', getState());
    }
  };

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

  const handleServiceUpdate = (): void => {
    emit('update', getState());
  };

  const pauseTimer = (): void => {
    timerService.pauseTimer();
  };

  const selectTask = (taskId: string): void => {
    appService.selectTask(taskId);
  };

  const setReady = (): void => {
    appService.setReady();
  };

  const startTimer = (): void => {
    timerService.startTimer();
  };

  const getState = (): PomelloState => {
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
      value: appState.value,
      currentTaskId: appState.context.currentTaskId,
      timer,
    };
  };

  appService.on('transition', handleAppTransition);
  appService.on('update', handleServiceUpdate);

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
