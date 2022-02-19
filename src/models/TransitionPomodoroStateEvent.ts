import { AppEventType } from './AppEventType';
import { AppPomodoroStateValue } from './AppPomodoroStateValue';
import { EventObject } from './EventObject';

export type TransitionPomodoroStateEvent = EventObject<
  AppEventType.transitionPomodoroState,
  { target: AppPomodoroStateValue }
>;
