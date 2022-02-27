import createState from './createState';
import { AppContext, AppState, CreateAppServiceOptions } from './models';

const createAppService = ({ onStateChange }: CreateAppServiceOptions) => {
  const { getState, setState } = createState<AppState, AppContext>({
    initialState: AppState.initializing,
    context: {
      currentTaskId: null,
    },
    onStateChange,
  });

  const completeTask = (): void => {
    setState(AppState.taskCompletePrompt);
  };

  const selectTask = (taskId: string): void => {
    setState(AppState.task, {
      currentTaskId: taskId,
    });
  };

  const setAppState = (target: AppState): void => {
    setState(target);
  };

  const switchTask = (): void => {
    setState(AppState.selectTask, {
      currentTaskId: null,
    });
  };

  const unsetCurrentTask = (): void => {
    setState(null, {
      currentTaskId: null,
    });
  };

  const voidTask = (): void => {
    setState(AppState.taskVoidPrompt);
  };

  return {
    completeTask,
    getState,
    selectTask,
    setAppState,
    switchTask,
    unsetCurrentTask,
    voidTask,
  };
};

export default createAppService;
