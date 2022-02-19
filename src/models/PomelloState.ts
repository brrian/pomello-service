export interface PomelloState {
  value: 'INITIALIZING' | 'SELECT_TASK' | 'TASK' | 'TASK_TIMER_END_PROMPT';
  currentTaskId: string | null;
  timer: Timer | null;
}

interface Timer {
  isActive: boolean;
  isInjected: boolean;
  isPaused: boolean;
  time: number;
  totalTime: number;
}
