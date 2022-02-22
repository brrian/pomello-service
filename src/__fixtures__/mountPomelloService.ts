import createPomelloService from '..';
import { PomelloSettings, PomelloState, Ticker } from '../models';

interface MountPomelloServiceOptions {
  initialize?: boolean;
  onServiceUpdate?: (state: PomelloState) => void;
  settings?: Partial<PomelloSettings>;
}

const defaultSettings: PomelloSettings = {
  set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
  shortBreakTime: 5,
  taskTime: 30,
};

function createTicker(): Ticker {
  let tickId: NodeJS.Timeout | undefined;

  return {
    start: tick => {
      tickId = setInterval(tick, 1000);
    },
    stop: () => {
      if (tickId) {
        clearInterval(tickId);
      }
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
      jest.runAllTimers();
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
