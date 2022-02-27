import createState from './createState';
import { CreateTimerOptions, CreateTimerServiceOptions, TimerContext, TimerState } from './models';

const createTimerService = ({
  onStateChange,
  onTimerEnd,
  onTimerTick,
  ticker,
}: CreateTimerServiceOptions) => {
  const { getState, setState } = createState<TimerState, TimerContext>({
    initialState: TimerState.idle,
    context: {
      timer: null,
    },
    onStateChange,
  });

  const startTicker = (): void => {
    ticker.start(() => {
      tickTimer();

      onTimerTick();
    });
  };

  const tickTimer = (): void => {
    const { timer } = getState().context;

    if (timer) {
      if (timer.time === 1) {
        setState(TimerState.idle, { timer: null });

        ticker.stop();

        onTimerEnd(timer);
      } else {
        setState(null, {
          timer: {
            ...timer,
            time: timer.time - 1,
          },
        });
      }
    }
  };

  const createTimer = ({ isInjected = false, time, type }: CreateTimerOptions): void => {
    setState(TimerState.ready, {
      timer: {
        isInjected,
        time,
        totalTime: time,
        type,
      },
    });
  };

  const destroyTimer = (): void => {
    setState(TimerState.idle, { timer: null });

    ticker.stop();
  };

  const pauseTimer = (): void => {
    setState(TimerState.paused);

    ticker.stop();
  };

  const startTimer = (): void => {
    setState(TimerState.active);

    startTicker();
  };

  return {
    createTimer,
    destroyTimer,
    pauseTimer,
    startTimer,
    getState,
  };
};

export default createTimerService;
