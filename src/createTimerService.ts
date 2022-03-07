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
      const newTimer = {
        ...timer,
        time: timer.time - 1,
      };

      setState(null, { timer: newTimer });

      if (newTimer.time === 0) {
        ticker.stop();

        onTimerEnd(newTimer);

        // In certain cases, a new timer will already have been created after
        // onTimerEnd finishes. So we just check to see if it was the same timer
        // that was ended before cleaning it up.
        const { timer: currentTimer } = getState().context;

        if (currentTimer && currentTimer.time === 0) {
          setState(TimerState.idle, { timer: null });
        }
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
