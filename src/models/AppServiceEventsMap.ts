import { AppState } from './AppState';
import { AppTransitionEvent } from './AppTransitionEvent';

export type AppServiceEventsMap = {
  transition: AppTransitionEvent;
  update: AppState;
};
