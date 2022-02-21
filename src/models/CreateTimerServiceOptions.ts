import { State } from './State';
import { Ticker } from './Ticker';
import { TimerContext } from './TimerContext';
import { TimerState } from './TimerState';

export interface CreateTimerServiceOptions {
  onStateChange: (state: State<TimerState, TimerContext>) => void;
  onTimerEnd: () => void;
  onTimerTick: () => void;
  ticker: Ticker;
}
