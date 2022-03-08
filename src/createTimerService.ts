import createState from './createState';
import { CreateTimerOptions, CreateTimerServiceOptions, TimerContext, TimerState } from './models';

interface Marker {
  time: number;
  timestamp: number;
  ttl?: number;
}

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

  const markers = new Map<string, Marker>();

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

  const getMarker = (id: string): Marker | null => {
    const marker = markers.get(id);

    if (
      !marker ||
      (marker.ttl !== undefined && Date.now() - marker.timestamp > marker.ttl * 1000)
    ) {
      markers.delete(id);

      return null;
    }

    return marker;
  };

  const pauseTimer = (): void => {
    setState(TimerState.paused);

    ticker.stop();
  };

  const setMarker = (id: string, ttl?: number): void => {
    const { timer } = getState().context;

    if (timer) {
      markers.set(id, {
        time: timer.time,
        timestamp: Date.now(),
        ttl,
      });
    }
  };

  const startTimer = (): void => {
    setState(TimerState.active);

    startTicker();
  };

  const unsetMarker = (id: string): void => {
    markers.delete(id);
  };

  return {
    createTimer,
    destroyTimer,
    getMarker,
    getState,
    pauseTimer,
    setMarker,
    startTimer,
    unsetMarker,
  };
};

export default createTimerService;
