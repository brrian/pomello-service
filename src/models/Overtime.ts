import { TimerType } from './TimerType';

export interface Overtime {
  taskId: string | null;
  time: number;
  type: TimerType;
}
