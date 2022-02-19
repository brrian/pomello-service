import { AppStateValue } from './AppStateValue';

export type AppPomodoroStateValue =
  | AppStateValue.task
  | AppStateValue.shortBreak
  | AppStateValue.longBreak;
