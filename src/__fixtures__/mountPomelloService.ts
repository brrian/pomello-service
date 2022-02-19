import createPomelloService from '..';
import { PomelloSettings, PomelloState, Ticker } from '../models';

interface MountPomelloServiceOptions {
  initialize?: boolean;
  onServiceUpdate?: (state: PomelloState) => void;
  settings?: Partial<PomelloSettings>;
}

const defaultSettings: PomelloSettings = {
  set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
  taskTime: 30,
};

const createTicker = (): Ticker => {
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
};

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

  const advanceTimer = (seconds?: number) => {
    if (!seconds) {
      jest.runAllTimers();
    } else {
      jest.advanceTimersByTime(seconds * 1000);
    }
  };

  const attachUpdateHandler = () => {
    service.on('update', onServiceUpdate);

    return onServiceUpdate;
  };

  return {
    advanceTimer,
    attachUpdateHandler,
    service,
  };
}
