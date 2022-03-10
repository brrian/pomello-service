import createState from './createState';
import {
  CancelWait,
  CreateOvertimeServiceOptions,
  OvertimeContext,
  OvertimeState,
  StartOvertimeCountdownOptions,
} from './models';

const createOvertimeService = ({
  onOvertimeStart,
  onOvertimeTick,
  onStateChange,
  ticker,
}: CreateOvertimeServiceOptions) => {
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

  const startOvertimeCountdown = ({ delay, taskId, type }: StartOvertimeCountdownOptions): void => {
    cancelOvertimeCountdown = ticker.wait(() => {
      const overtime = {
        taskId,
        time: delay,
        type,
      };

      setState(OvertimeState.active, { overtime });

      ticker.start(tickTimer);

      onOvertimeStart(overtime);
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

      onOvertimeTick();
    }
  };

  return {
    endOvertime,
    startOvertimeCountdown,
    getState,
  };
};

export default createOvertimeService;
