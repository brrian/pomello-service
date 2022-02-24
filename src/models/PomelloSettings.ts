export interface PomelloSettings {
  longBreakTime: number;
  set: SetItem[];
  shortBreakTime: number;
  taskTime: number;
}

type SetItem = 'task' | 'shortBreak' | 'longBreak';
