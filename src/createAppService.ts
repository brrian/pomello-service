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

  function selectTask(taskId: string): void {
    setState(AppState.task, {
      currentTaskId: taskId,
    });
  }

  function setAppState(target: AppState): void {
    setState(target);
  }

  return {
    selectTask,
    setAppState,
    getState,
  };
}
