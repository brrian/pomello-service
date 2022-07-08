declare type CancelWait = () => void;

declare enum TimerType {
    task = "TASK",
    shortBreak = "SHORT_BREAK",
    longBreak = "LONG_BREAK"
}

declare type TickerStart = (tick: Tick) => void;
declare type Tick = () => void;

declare type TickerStop = () => void;

declare type TickerWait = (callback: () => void, delay: number) => CancelWait;

interface Ticker {
    start: TickerStart;
    stop: TickerStop;
    wait: TickerWait;
}

interface PomelloEvent {
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

interface PomelloState {
    value: 'INITIALIZING' | 'SELECT_TASK' | 'TASK' | 'TASK_COMPLETE_PROMPT' | 'TASK_VOID_PROMPT' | 'TASK_TIMER_END_PROMPT' | 'SHORT_BREAK' | 'LONG_BREAK';
    currentTaskId: string | null;
    timer: Timer | null;
    overtime: Overtime | null;
}
interface Timer {
    isActive: boolean;
    isInjected: boolean;
    isPaused: boolean;
    time: number;
    totalTime: number;
}
interface Overtime {
    time: number;
    type: TimerType;
}

declare type PomelloEventMap = {
    appInitialize: PomelloEvent;
    overtimeEnd: PomelloEvent;
    overtimeStart: PomelloEvent;
    overtimeTick: PomelloEvent;
    taskEnd: PomelloEvent;
    taskSelect: PomelloEvent;
    taskStart: PomelloEvent;
    taskVoid: PomelloEvent;
    timerEnd: PomelloEvent;
    timerPause: PomelloEvent;
    timerResume: PomelloEvent;
    timerSkip: PomelloEvent;
    timerStart: PomelloEvent;
    timerTick: PomelloEvent;
    update: PomelloState;
};

interface PomelloSettings {
    betweenTasksGracePeriod: number;
    longBreakTime: number;
    overtimeDelay: number;
    set: SetItem[];
    shortBreakTime: number;
    taskTime: number;
}
declare type SetItem = 'task' | 'shortBreak' | 'longBreak';

interface PomelloServiceConfig {
    createTicker: () => Ticker;
    settings: PomelloSettings;
}

declare type TaskTimerEndPromptHandledAction = 'continueTask' | 'switchTask' | 'voidTask';

declare type PomelloService = ReturnType<typeof createPomelloService>;
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

export { PomelloService, PomelloSettings, Ticker, TickerStart, TickerStop, TickerWait, createPomelloService as default };
