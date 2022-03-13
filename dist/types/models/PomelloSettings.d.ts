export interface PomelloSettings {
    betweenTasksGracePeriod: number;
    longBreakTime: number;
    overtimeDelay: number;
    set: SetItem[];
    shortBreakTime: number;
    taskTime: number;
}
declare type SetItem = 'task' | 'shortBreak' | 'longBreak';
export {};
//# sourceMappingURL=PomelloSettings.d.ts.map