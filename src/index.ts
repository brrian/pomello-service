import createAppService from './createAppService';
import createEventEmitter from './createEventEmitter';
import createOvertimeService from './createOvertimeService';
import createTimerService from './createTimerService';
import {
  AppState,
  Overtime,
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

export type { PomelloSettings } from './models';

const createPomelloService = ({
  createTicker,
  settings: initialSettings,
}: PomelloServiceConfig) => {
  let settings = initialSettings;

  const { batchedEmit, emit, on, off } = createEventEmitter<PomelloEventMap>();

  const handleOvertimeStart = (overtime: Overtime): void => {
    // Due to the overtime delay, when this is triggered the overtime is already
    // active. So we need to offset the time by the overtimeDelay.
    emit(
      'overtimeStart',
      createPomelloEvent({
        overtime: { ...overtime, time: 0 },
        timestamp: Date.now() - overtime.time * 1000,
      })
    );
  };

  const handleOvertimeTick = (): void => {
    emit('overtimeTick', createPomelloEvent());
  };

  const handleTimerEnd = (timer: Timer): void => {
    emit('timerEnd', createPomelloEvent());

    // Injected timers aren't part of the set, so don't increment the index.
    if (!timer.isInjected) {
      incrementSetIndex();
    }

    if (appService.getState().value === AppState.task) {
      timerService.setMarker('taskEnd');

      appService.setAppState(AppState.taskTimerEndPrompt);

      emit('taskEnd', createPomelloEvent());
    } else if (appService.getState().value !== AppState.taskCompletePrompt) {
      transitionPomodoroState();
    }

    overtimeService.startOvertimeCountdown({
      delay: settings.overtimeDelay,
      taskId: appService.getState().context.currentTaskId,
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
        const { timer } = timerService.getState().context;

        if (!timer || timer.time === 0) {
          timerService.createTimer({
            time: settings.taskTime,
            type: TimerType.task,
          });
        } else {
          // The timer already exists, so we're starting a new task

          let eventOverrides = undefined;

          const tarkStartMarker = timerService.getMarker('taskStart');
          const expirationTimestamp = Date.now() - settings.betweenTasksGracePeriod * 1000;

          if (tarkStartMarker && tarkStartMarker.timestamp > expirationTimestamp) {
            eventOverrides = {
              timer: {
                time: tarkStartMarker.timer.time,
                totalTime: timer.totalTime,
                type: timer.type,
              },
              timestamp: tarkStartMarker.timestamp,
            };
          } else {
            timerService.setMarker('taskStart');
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
    emit('taskEnd', createPomelloEvent());

    timerService.setMarker('taskStart');

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

    let eventOverrides = undefined;

    const taskStartMarker = timerService.getMarker('taskStart');
    if (taskStartMarker) {
      eventOverrides = {
        timer: {
          time: taskStartMarker.timer.time,
          totalTime: taskStartMarker.timer.totalTime,
          type: taskStartMarker.timer.type,
        },
        timestamp: taskStartMarker.timestamp,
      };
    }

    emit('taskSelect', createPomelloEvent(eventOverrides));

    transitionPomodoroState();
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

    timerService.setMarker('taskStart');
  };

  const switchTask = (): void => {
    emit('taskEnd', createPomelloEvent());

    timerService.setMarker('taskStart');

    appService.switchTask();
  };

  const taskCompleteHandled = (): void => {
    appService.unsetCurrentTask();

    transitionPomodoroState();

    if (timerService.getState().value !== TimerState.active) {
      startTimer();
    }
  };

  const taskTimerEndPromptHandled = (action: TaskTimerEndPromptHandledAction): void => {
    if (action === 'voidTask') {
      decrementSetIndex();

      voidTask();
    } else {
      if (action === 'switchTask') {
        appService.unsetCurrentTask();
      }

      transitionPomodoroState();

      startTimer();
    }

    timerService.clearMarkers();
  };

  const updateSettings = (updatedSettings: PomelloSettings): void => {
    settings = updatedSettings;
  };

  const voidTask = (): void => {
    const eventOverrides: Partial<PomelloEvent> = {};

    // If the task was voided after the timer has ended, then we need to do some
    // extra steps to figure out how much time to void.
    if (timerService.getState().value === TimerState.idle) {
      const taskStartMarker = timerService.getMarker('taskStart');
      const taskEndMarker = timerService.getMarker('taskEnd');

      if (taskStartMarker && taskEndMarker) {
        eventOverrides.timer = {
          time: taskStartMarker.timer.time,
          totalTime: taskStartMarker.timer.totalTime,
          type: taskStartMarker.timer.type,
        };

        eventOverrides.timestamp = taskEndMarker.timestamp;
      }
    }

    emit('taskVoid', createPomelloEvent(eventOverrides));

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
