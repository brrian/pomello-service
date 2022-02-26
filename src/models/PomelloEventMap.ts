import { PomelloState } from './PomelloState';

export type PomelloEventMap = {
  appInitialize: PomelloState;
  taskSelect: PomelloState;
  taskVoid: PomelloState;
  timerEnd: PomelloState;
  timerPause: PomelloState;
  timerResume: PomelloState;
  timerSkip: PomelloState;
  timerStart: PomelloState;
  timerTick: PomelloState;
  update: PomelloState;
};
