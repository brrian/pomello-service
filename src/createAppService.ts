import createState from './createState';
import { AppContext, PomelloStatus, CreateAppServiceOptions } from './models';

const createAppService = ({ onStateChange }: CreateAppServiceOptions) => {
  const { getState, setState } = createState<PomelloStatus, AppContext>({
    initialState: PomelloStatus.initializing,
    context: {
      currentTaskId: null,
    },
    onStateChange,
  });

  const completeTask = (): void => {
    setState(PomelloStatus.taskCompletePrompt);
  };

  const selectTask = (taskId: string): void => {
    setState(PomelloStatus.task, {
      currentTaskId: taskId,
    });
  };

  const setAppState = (target: PomelloStatus): void => {
    setState(target);
  };

  const switchTask = (): void => {
    setState(PomelloStatus.selectTask, {
      currentTaskId: null,
    });
  };

  const unsetCurrentTask = (): void => {
    setState(null, {
      currentTaskId: null,
    });
  };

  const voidTask = (): void => {
    setState(PomelloStatus.taskVoidPrompt);
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
