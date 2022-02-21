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

  function handleTimerEnd(): void {
    setState(AppState.taskTimerEndPrompt);
  }

  function selectTask(taskId: string): void {
    setState(AppState.task, {
      currentTaskId: taskId,
    });
  }

  function transitionPomodoroState(target: AppState): void {
    setState(target);
  }

  return {
    handleTimerEnd,
    selectTask,
    transitionPomodoroState,
    getState,
  };
}
