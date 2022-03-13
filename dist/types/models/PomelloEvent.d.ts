import { TimerType } from './TimerType';
export interface PomelloEvent {
    taskId: string | null;
    timer: {
        time: number;
        totalTime: number;
        type: TimerType;
    } | null;
    overtime: {
        time: number;
        type: TimerType;
    } | null;
    timestamp: number;
}
//# sourceMappingURL=PomelloEvent.d.ts.map