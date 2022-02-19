export interface PomelloSettings {
  set: SetItem[];
  taskTime: number;
}

type SetItem = 'task' | 'shortBreak' | 'longBreak';
