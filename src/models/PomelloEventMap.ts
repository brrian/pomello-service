import { PomelloEvent } from './PomelloEvent';
import { PomelloState } from './PomelloState';

export type PomelloEventMap = {
  appInitialize: PomelloEvent;
  overtimeEnd: PomelloEvent;
  overtimeStart: PomelloEvent;
  overtimeTick: PomelloEvent;
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
