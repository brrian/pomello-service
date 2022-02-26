import { PomelloEvent } from './PomelloEvent';
import { PomelloState } from './PomelloState';

export type PomelloEventMap = {
  appInitialize: PomelloEvent;
  taskSelect: PomelloEvent;
  taskVoid: PomelloEvent;
  timerEnd: PomelloState;
  timerPause: PomelloState;
  timerResume: PomelloState;
  timerSkip: PomelloState;
  timerStart: PomelloState;
  timerTick: PomelloState;
  update: PomelloState;
};
