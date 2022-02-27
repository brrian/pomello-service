import { TimerType } from './TimerType';

export interface PomelloState {
  value:
    | 'INITIALIZING'
    | 'SELECT_TASK'
    | 'TASK'
    | 'TASK_COMPLETE_PROMPT'
    | 'TASK_VOID_PROMPT'
    | 'TASK_TIMER_END_PROMPT'
    | 'SHORT_BREAK'
    | 'LONG_BREAK';
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
