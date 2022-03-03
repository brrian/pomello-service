import createPomelloService from '..';
import { PomelloSettings, PomelloState, Ticker } from '../models';

interface MountPomelloServiceOptions {
  initialize?: boolean;
  onServiceUpdate?: (state: PomelloState) => void;
  settings?: Partial<PomelloSettings>;
}

const defaultSettings: PomelloSettings = {
  longBreakTime: 10,
  overtimeDelay: 5,
  set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
  shortBreakTime: 5,
  taskTime: 30,
};

const createTicker = (): Ticker => {
  let tickId: NodeJS.Timeout | undefined;
  let waitId: NodeJS.Timeout | undefined;

  return {
    start(tick) {
      tickId = setInterval(tick, 1000);
    },
    stop() {
      if (tickId) {
        clearInterval(tickId);
      }
    },
    wait(callback, delay) {
      waitId = setTimeout(callback, delay * 1000);

      return () => {
        if (waitId) {
          clearTimeout(waitId);
        }
      };
    },
  };
};

const mountPomelloService = ({
  onServiceUpdate = jest.fn(),
  settings = {},
  initialize = true,
}: MountPomelloServiceOptions = {}) => {
  const mergedSettings: PomelloSettings = {
    ...defaultSettings,
    ...settings,
  };

  const service = createPomelloService({
    createTicker,
    settings: mergedSettings,
  });

  if (initialize) {
    service.setReady();
  }

  const advanceTimer = (seconds?: number) => {
    if (!seconds) {
      // Advance the timer one at a time and explicitly check the timer state.
      // Otherwise, calling jest.runAllTimers will also run the overtime timers.
      // We also check the isActive state otherwise we can run into an infinite
      // loop if the next transition also has a timer.
      do {
        jest.runOnlyPendingTimers();
      } while (service.getState().timer?.isActive);
    } else {
      jest.advanceTimersByTime(seconds * 1000);
    }
  };

  const attachUpdateHandler = () => {
    service.on('update', onServiceUpdate);

    return onServiceUpdate;
  };

  const waitForBatchedEvents = () => {
    jest.advanceTimersByTime(1);
  };

  return {
    advanceTimer,
    attachUpdateHandler,
    service,
    settings: mergedSettings,
    waitForBatchedEvents,
  };
};

export default mountPomelloService;
