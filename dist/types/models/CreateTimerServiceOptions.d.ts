import { State } from './State';
import { Ticker } from './Ticker';
import { Timer } from './Timer';
import { TimerContext } from './TimerContext';
import { TimerState } from './TimerState';
export interface CreateTimerServiceOptions {
    onStateChange: (state: State<TimerState, TimerContext>) => void;
    onTimerEnd: (timer: Timer) => void;
    onTimerTick: () => void;
    ticker: Ticker;
}
//# sourceMappingURL=CreateTimerServiceOptions.d.ts.map