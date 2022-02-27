import { PomelloEvent } from './PomelloEvent';
import { PomelloState } from './PomelloState';

export type PomelloEventMap = {
  appInitialize: PomelloEvent;
  taskSelect: PomelloEvent;
  taskVoid: PomelloEvent;
  timerEnd: PomelloEvent;
  timerPause: PomelloEvent;
  timerResume: PomelloEvent;
  timerSkip: PomelloEvent;
  timerStart: PomelloEvent;
  timerTick: PomelloEvent;
  update: PomelloState;
};
