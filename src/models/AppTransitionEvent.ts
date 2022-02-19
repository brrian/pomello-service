import { AppState } from './AppState';

export interface AppTransitionEvent {
  state: AppState;
  prevState: AppState;
}
