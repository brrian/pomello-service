import { assign, createMachine, interpret } from '@xstate/fsm';
import createEventEmitter from './createEventEmitter';
import {
  CreateTimerOptions,
  TimerContext,
  TimerEvent,
  TimerEventType,
  TimerServiceEventsMap,
  TimerState,
  TimerStateValue,
  TimerTransitionEvent,
} from './models';

const createTimerService = () => {
  const { emit, on, off } = createEventEmitter<TimerServiceEventsMap>();

  const timerMachine = createMachine<TimerContext, TimerEvent, TimerState>({
    initial: TimerStateValue.idle,
    context: {
      timer: null,
    },
    states: {
      [TimerStateValue.idle]: {
        entry: assign<TimerContext>({
          timer: null,
        }),
        on: {
          [TimerEventType.createTimer]: {
            target: TimerStateValue.ready,
            actions: assign({
              timer: (_context, event) => ({
                isInjected: event.payload.isInjected ?? false,
                time: event.payload.time,
                totalTime: event.payload.time,
                type: event.payload.type,
              }),
            }),
          },
        },
      },
      [TimerStateValue.ready]: {
        on: {
          [TimerEventType.startTimer]: TimerStateValue.active,
        },
      },
      [TimerStateValue.active]: {
        on: {
          [TimerEventType.tickTimer]: [
            {
              target: TimerStateValue.idle,
              // context.timer will always exist in the active state
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              cond: context => context.timer!.time === 1,
            },
            {
              actions: assign({
                timer: context => ({
                  // see comment above
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  ...context.timer!,
                  // see comment above
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  time: context.timer!.time - 1,
                }),
              }),
            },
          ],
          [TimerEventType.pauseTimer]: TimerStateValue.paused,
        },
      },
      [TimerStateValue.paused]: {
        on: {
          [TimerEventType.startTimer]: TimerStateValue.active,
        },
      },
    },
  });

  const timerService = interpret(timerMachine);

  let prevState = timerService.state;

  timerService.subscribe(state => {
    if (!state.changed) {
      return;
    }

    if (prevState.value !== state.value) {
      emit('transition', { state, prevState } as TimerTransitionEvent);

      prevState = state;
    }

    emit('update', state as TimerState);
  });

  timerService.start();

  const createTimer = (options: CreateTimerOptions): void => {
    timerService.send({
      type: TimerEventType.createTimer,
      payload: options,
    });
  };

  const pauseTimer = (): void => {
    timerService.send({
      type: TimerEventType.pauseTimer,
    });
  };

  const startTimer = (): void => {
    timerService.send(TimerEventType.startTimer);
  };

  const tickTimer = (): void => {
    timerService.send(TimerEventType.tickTimer);
  };

  const getState = () => timerService.state;

  return {
    createTimer,
    pauseTimer,
    startTimer,
    tickTimer,
    getState,
    on,
    off,
  };
};

export default createTimerService;
