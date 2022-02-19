import { assign, createMachine, interpret, StateMachine } from '@xstate/fsm';
import createEventEmitter from './createEventEmitter';
import {
  AppContext,
  AppEvent,
  AppEventType,
  AppPomodoroStateValue,
  AppServiceEventsMap,
  AppState,
  AppStateValue,
  AppTransitionEvent,
  TransitionPomodoroStateEvent,
} from './models';

const createAppService = () => {
  const { emit, on, off } = createEventEmitter<AppServiceEventsMap>();

  const pomodoroTransitions: StateMachine.Transition<AppContext, TransitionPomodoroStateEvent>[] = [
    {
      target: AppStateValue.selectTask,
      cond: (context, event) =>
        context.currentTaskId === null && event.payload.target === AppStateValue.task,
    },
    {
      target: AppStateValue.task,
      cond: (_context, event) => event.payload.target === AppStateValue.task,
    },
    {
      target: AppStateValue.shortBreak,
      cond: (_context, event) => event.payload.target === AppStateValue.shortBreak,
    },
    {
      target: AppStateValue.longBreak,
      cond: (_context, event) => event.payload.target === AppStateValue.longBreak,
    },
  ];

  const appMachine = createMachine<AppContext, AppEvent, AppState>({
    initial: AppStateValue.initializing,
    context: {
      currentTaskId: null,
    },
    states: {
      [AppStateValue.initializing]: {
        on: {
          [AppEventType.transitionPomodoroState]: pomodoroTransitions,
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

  let prevState = appService.state;

  appService.subscribe(state => {
    if (!state.changed) {
      return;
    }

    if (prevState.value !== state.value) {
      emit('transition', { state, prevState } as AppTransitionEvent);

      prevState = state;
    }

    emit('update', state as AppState);
  });

  appService.start();

  const handleTimerEnd = (): void => {
    appService.send(AppEventType.timerEnd);
  };

  const selectTask = (taskId: string): void => {
    appService.send({ type: AppEventType.selectTask, payload: { taskId } });
  };

  const transitionPomodoroState = (target: AppPomodoroStateValue): void => {
    appService.send({ type: AppEventType.transitionPomodoroState, payload: { target } });
  };

  const getState = () => appService.state;

  return {
    handleTimerEnd,
    selectTask,
    transitionPomodoroState,
    getState,
    on,
    off,
  };
};

export default createAppService;
