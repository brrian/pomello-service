import { Timer } from './Timer';
import { TimerContext } from './TimerContext';
import { TimerStateValue } from './TimerStateValue';

export type TimerState =
  | { value: TimerStateValue.idle; context: TimerContext & { timer: null } }
  | { value: TimerStateValue.ready; context: TimerContext & { timer: Timer } }
  | { value: TimerStateValue.active; context: TimerContext & { timer: Timer } }
  | { value: TimerStateValue.paused; context: TimerContext & { timer: Timer } };
