import { CreateTimerOptions } from './CreateTimerOptions';
import { EventObject } from './EventObject';
import { TimerEventType } from './TimerEventType';

export type TimerEvent = CreateTimerEvent | PauseTimerEvent | StartTimerEvent | TickTimerEvent;

type CreateTimerEvent = EventObject<TimerEventType.createTimer, CreateTimerOptions>;

type PauseTimerEvent = EventObject<TimerEventType.pauseTimer>;

type StartTimerEvent = EventObject<TimerEventType.startTimer>;

type TickTimerEvent = EventObject<TimerEventType.tickTimer>;
