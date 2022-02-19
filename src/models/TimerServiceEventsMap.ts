import { TimerState } from './TimerState';
import { TimerTransitionEvent } from './TimerTransitionEvent';

export type TimerServiceEventsMap = { transition: TimerTransitionEvent; update: TimerState };
