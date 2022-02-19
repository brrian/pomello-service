import { TimerType } from './TimerType';

export interface CreateTimerOptions {
  isInjected?: boolean;
  time: number;
  type: TimerType;
}
