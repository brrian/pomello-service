import { AppContext } from './AppContext';
import { AppStateValue } from './AppStateValue';

export type AppState =
  | { value: AppStateValue.initializing; context: AppContext }
  | { value: AppStateValue.selectTask; context: AppContext }
  | { value: AppStateValue.task; context: AppContext & { currentTaskId: string } }
  | { value: AppStateValue.taskTimerEndPrompt; context: AppContext & { currentTaskId: string } };
