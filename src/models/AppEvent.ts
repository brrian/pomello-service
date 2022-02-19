import { AppEventType } from './AppEventType';
import { EventObject } from './EventObject';
import { TransitionPomodoroStateEvent } from './TransitionPomodoroStateEvent';

export type AppEvent = SelectTaskEvent | TimerEndEvent | TransitionPomodoroStateEvent;

type SelectTaskEvent = EventObject<AppEventType.selectTask, { taskId: string }>;

type TimerEndEvent = EventObject<AppEventType.timerEnd>;
