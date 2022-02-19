import { assign, createMachine, interpret } from '@xstate/fsm';
import createEventEmitter from './createEventEmitter';
import {
  AppContext,
  AppEvent,
  AppEventType,
  AppServiceEventsMap,
  AppState,
  AppStateValue,
} from './models';

const createAppService = () => {
  const { emit, on, off } = createEventEmitter<AppServiceEventsMap>();

  const appMachine = createMachine<AppContext, AppEvent, AppState>({
    initial: AppStateValue.initializing,
    context: {
      currentTaskId: null,
    },
    states: {
      [AppStateValue.initializing]: {
        on: {
          [AppEventType.setReady]: AppStateValue.selectTask,
        },
      },
      [AppStateValue.selectTask]: {
        on: {
          [AppEventType.selectTask]: {
            target: AppStateValue.task,
            actions: assign((_context, event) => ({ currentTaskId: event.payload.taskId })),
          },
        },
      },
      [AppStateValue.task]: {
        on: {
          [AppEventType.timerEnd]: AppStateValue.taskTimerEndPrompt,
        },
      },
      [AppStateValue.taskTimerEndPrompt]: {},
    },
  });

  const appService = interpret(appMachine);

  let prevState = appService.state.value;

  appService.subscribe(state => {
    if (!state.changed) {
      return;
    }

    if (prevState !== state.value) {
      emit('transition', state as AppState);

      prevState = state.value;
    }

    emit('update', state as AppState);
  });

  appService.start();

  const handleTimerEnd = (): void => {
    appService.send(AppEventType.timerEnd);
  };

  const setReady = (): void => {
    appService.send(AppEventType.setReady);
  };

  const selectTask = (taskId: string): void => {
    appService.send({ type: AppEventType.selectTask, payload: { taskId } });
  };

  const getState = () => appService.state;

  return {
    handleTimerEnd,
    setReady,
    selectTask,
    getState,
    on,
    off,
  };
};

export default createAppService;
