export interface PomelloSettings {
  betweenTasksGracePeriod: number;
  longBreakTime: number;
  overtimeDelay: number;
  set: SetItem[];
  shortBreakTime: number;
  taskTime: number;
}

type SetItem = 'task' | 'shortBreak' | 'longBreak';
