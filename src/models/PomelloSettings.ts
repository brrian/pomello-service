export interface PomelloSettings {
  longBreakTime: number;
  overtimeDelay: number;
  set: SetItem[];
  shortBreakTime: number;
  taskTime: number;
}

type SetItem = 'task' | 'shortBreak' | 'longBreak';
