import { PomelloState } from './PomelloState';

export type PomelloEventMap = {
  appInitialize: PomelloState;
  taskSelect: PomelloState;
  timerEnd: PomelloState;
  timerPause: PomelloState;
  timerResume: PomelloState;
  timerStart: PomelloState;
  timerTick: PomelloState;
  update: PomelloState;
};
