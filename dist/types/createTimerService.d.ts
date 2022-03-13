import { CreateTimerOptions, CreateTimerServiceOptions, Timer, TimerContext, TimerState } from './models';
interface Marker {
    timer: Timer;
    timestamp: number;
}
declare const createTimerService: ({ onStateChange, onTimerEnd, onTimerTick, ticker, }: CreateTimerServiceOptions) => {
    clearMarkers: () => void;
    createTimer: ({ isInjected, time, type }: CreateTimerOptions) => void;
    destroyTimer: () => void;
    getMarker: (id: string) => Marker | null;
    getState: () => {
        value: TimerState;
        context: TimerContext;
    };
    pauseTimer: () => void;
    setMarker: (id: string) => void;
    startTimer: () => void;
};
export default createTimerService;
//# sourceMappingURL=createTimerService.d.ts.map