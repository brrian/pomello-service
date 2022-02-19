import { AppEventType } from './AppEventType';
import { EventObject } from './EventObject';

export type AppEvent = SelectTaskEvent | SetReadyEvent | TimerEndEvent;

type SelectTaskEvent = EventObject<AppEventType.selectTask, { taskId: string }>;

type SetReadyEvent = EventObject<AppEventType.setReady>;

type TimerEndEvent = EventObject<AppEventType.timerEnd>;
