import createState from './createState';
import {
  CancelWait,
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

  let cancelOvertimeCountdown: CancelWait | null = null;

  const endOvertime = (): void => {
    if (getState().value === OvertimeState.active) {
      setState(OvertimeState.idle, {
        overtime: null,
      });

      ticker.stop();
    } else if (cancelOvertimeCountdown) {
      cancelOvertimeCountdown();
      cancelOvertimeCountdown = null;
    }
  };

  const startOvertimeCountdown = ({ delay, type }: StartOvertimeCountdownOptions): void => {
    cancelOvertimeCountdown = ticker.wait(() => {
      setState(OvertimeState.active, {
        overtime: {
          time: delay,
          type,
        },
      });

      ticker.start(tickTimer);
    }, delay);
  };

  const tickTimer = (): void => {
    const { overtime } = getState().context;

    if (overtime) {
      setState(null, {
        overtime: {
          ...overtime,
          time: overtime.time + 1,
        },
      });
    }
  };

  return {
    endOvertime,
    startOvertimeCountdown,
    getState,
  };
};

export default createOvertimeService;
