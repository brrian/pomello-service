import { TimerType } from './TimerType';

export interface PomelloEvent {
  taskId: string | null;
  timer: {
    time: number;
    totalTime: number;
    type: TimerType;
  } | null;
  timestamp: number;
}
