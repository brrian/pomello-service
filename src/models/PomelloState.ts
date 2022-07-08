import { PomelloStatus } from './PomelloStatus';
import { TimerType } from './TimerType';

export interface PomelloState {
  status: PomelloStatus;
  currentTaskId: string | null;
  timer: Timer | null;
  overtime: Overtime | null;
}

interface Timer {
  isActive: boolean;
  isInjected: boolean;
  isPaused: boolean;
  time: number;
  totalTime: number;
}

interface Overtime {
  time: number;
  type: TimerType;
}
