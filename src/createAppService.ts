import createState from './createState';
import { AppContext, AppState, CreateAppServiceOptions } from './models';

export default function createAppService({ onStateChange }: CreateAppServiceOptions) {
  const { getState, setState } = createState<AppState, AppContext>({
    initialState: AppState.initializing,
    context: {
      currentTaskId: null,
    },
    onStateChange,
  });

  function completeTask(): void {
    setState(AppState.taskFinishPrompt);
  }

  function selectTask(taskId: string): void {
    setState(AppState.task, {
      currentTaskId: taskId,
    });
  }

  function setAppState(target: AppState): void {
    setState(target);
  }

  function switchTask(): void {
    setState(AppState.selectTask, {
      currentTaskId: null,
    });
  }

  function unsetCurrentTask(): void {
    setState(null, {
      currentTaskId: null,
    });
  }

  return {
    completeTask,
    getState,
    selectTask,
    setAppState,
    switchTask,
    unsetCurrentTask,
  };
}
