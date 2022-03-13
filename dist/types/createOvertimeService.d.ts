import { CreateOvertimeServiceOptions, OvertimeContext, OvertimeState, StartOvertimeCountdownOptions } from './models';
declare const createOvertimeService: ({ onOvertimeStart, onOvertimeTick, onStateChange, ticker, }: CreateOvertimeServiceOptions) => {
    endOvertime: () => void;
    startOvertimeCountdown: ({ delay, taskId, type }: StartOvertimeCountdownOptions) => void;
    getState: () => {
        value: OvertimeState;
        context: OvertimeContext;
    };
};
export default createOvertimeService;
//# sourceMappingURL=createOvertimeService.d.ts.map