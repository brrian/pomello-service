import { Overtime } from './Overtime';
import { OvertimeContext } from './OvertimeContext';
import { OvertimeState } from './OvertimeState';
import { State } from './State';
import { Ticker } from './Ticker';

export interface CreateOvertimeServiceOptions {
  onOvertimeStart: (overtime: Overtime) => void;
  onOvertimeTick: () => void;
  onStateChange: (state: State<OvertimeState, OvertimeContext>) => void;
  ticker: Ticker;
}
