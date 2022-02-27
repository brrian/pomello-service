import createState from './createState';
import {
  CreateOvertimeServiceOptions,
  OvertimeContext,
  OvertimeState,
  StartOvertimeCountdownOptions,
} from './models';

const createOvertimeService = ({ onStateChange, ticker }: CreateOvertimeServiceOptions) => {
  const { getState, setState } = createState<OvertimeState, OvertimeContext>({
    initialState: OvertimeState.idle,
    context: {
      overtime: null,
    },
    onStateChange,
  });

  function startOvertimeCountdown({ delay, type }: StartOvertimeCountdownOptions): void {
    ticker.wait(function () {
      setState(OvertimeState.active, {
        overtime: {
          time: delay,
          type,
        },
      });
    }, delay);
  }

  return {
    startOvertimeCountdown,
    getState,
  };
};

export default createOvertimeService;
