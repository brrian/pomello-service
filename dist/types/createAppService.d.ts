import { AppContext, AppState, CreateAppServiceOptions } from './models';
declare const createAppService: ({ onStateChange }: CreateAppServiceOptions) => {
    completeTask: () => void;
    getState: () => {
        value: AppState;
        context: AppContext;
    };
    selectTask: (taskId: string) => void;
    setAppState: (target: AppState) => void;
    switchTask: () => void;
    unsetCurrentTask: () => void;
    voidTask: () => void;
};
export default createAppService;
//# sourceMappingURL=createAppService.d.ts.map