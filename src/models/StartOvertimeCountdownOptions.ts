import { TimerType } from './TimerType';

export interface StartOvertimeCountdownOptions {
  delay: number;
  taskId: string | null;
  type: TimerType;
}
