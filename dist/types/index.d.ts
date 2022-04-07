import { PomelloEventMap, PomelloServiceConfig, PomelloSettings, PomelloState, TaskTimerEndPromptHandledAction } from './models';
export type { PomelloSettings, Ticker } from './models';
export declare type PomelloService = ReturnType<typeof createPomelloService>;
declare const createPomelloService: ({ createTicker, settings: initialSettings, }: PomelloServiceConfig) => {
    completeTask: () => void;
    getState: () => PomelloState;
    off: <TEventType extends keyof PomelloEventMap>(event: TEventType, handler: (data: PomelloEventMap[TEventType]) => void) => void;
    on: <TEventType_1 extends keyof PomelloEventMap>(event: TEventType_1, handler: (data: PomelloEventMap[TEventType_1]) => void) => void;
    pauseTimer: () => void;
    selectTask: (taskId: string) => void;
    setReady: () => void;
    skipTimer: () => void;
    startTimer: () => void;
    switchTask: () => void;
    taskCompleteHandled: () => void;
    taskTimerEndPromptHandled: (action: TaskTimerEndPromptHandledAction) => void;
    updateSettings: (updatedSettings: PomelloSettings) => void;
    voidPromptHandled: () => void;
    voidTask: () => void;
};
export default createPomelloService;
//# sourceMappingURL=index.d.ts.map