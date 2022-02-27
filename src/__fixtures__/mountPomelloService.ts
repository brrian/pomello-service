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

function createTicker(): Ticker {
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

      return function () {
        if (waitId) {
          clearTimeout(waitId);
        }
      };
    },
  };
}

export default function mountPomelloService({
  onServiceUpdate = jest.fn(),
  settings = {},
  initialize = true,
}: MountPomelloServiceOptions = {}) {
  const service = createPomelloService({
    createTicker,
    settings: {
      ...defaultSettings,
      ...settings,
    },
  });

  if (initialize) {
    service.setReady();
  }

  function advanceTimer(seconds?: number) {
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
  }

  function attachUpdateHandler() {
    service.on('update', onServiceUpdate);

    return onServiceUpdate;
  }

  function waitForBatchedEvents() {
    jest.advanceTimersByTime(1);
  }

  return {
    advanceTimer,
    attachUpdateHandler,
    service,
    waitForBatchedEvents,
  };
}
