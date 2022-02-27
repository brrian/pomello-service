import { OvertimeContext } from './OvertimeContext';
import { OvertimeState } from './OvertimeState';
import { State } from './State';
import { Ticker } from './Ticker';

export interface CreateOvertimeServiceOptions {
  onStateChange: (state: State<OvertimeState, OvertimeContext>) => void;
  ticker: Ticker;
}
