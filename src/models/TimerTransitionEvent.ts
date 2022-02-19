import { TimerState } from './TimerState';

export interface TimerTransitionEvent {
  state: TimerState;
  prevState: TimerState;
}
