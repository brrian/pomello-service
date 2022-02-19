import { TimerType } from './TimerType';

export interface Timer {
  isInjected: boolean;
  time: number;
  totalTime: number;
  type: TimerType;
}
