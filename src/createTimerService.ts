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

  function startTicker(): void {
    ticker.start(() => {
      tickTimer();

      onTimerTick();
    });
  }

  function tickTimer(): void {
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
  }

  function createTimer({ isInjected = false, time, type }: CreateTimerOptions): void {
    setState(TimerState.ready, {
      timer: {
        isInjected,
        time,
        totalTime: time,
        type,
      },
    });
  }

  function destroyTimer(): void {
    setState(TimerState.idle, { timer: null });

    ticker.stop();
  }

  function pauseTimer(): void {
    setState(TimerState.paused);

    ticker.stop();
  }

  function startTimer(): void {
    setState(TimerState.active);

    startTicker();
  }

  return {
    createTimer,
    destroyTimer,
    pauseTimer,
    startTimer,
    getState,
  };
};

export default createTimerService;
