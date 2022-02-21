export interface PomelloSettings {
  set: SetItem[];
  shortBreakTime: number;
  taskTime: number;
}

type SetItem = 'task' | 'shortBreak' | 'longBreak';
