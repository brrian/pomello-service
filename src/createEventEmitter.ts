type EventMap = Record<string, unknown>;

type EventHandler<TData = never> = (data: TData) => void;

const createEventEmitter = <TEventMap extends EventMap>() => {
  const subscribers: Partial<Record<keyof TEventMap, EventHandler[]>> = {};

  const queuedEvents = new Map<keyof TEventMap, TEventMap[keyof TEventMap]>();

  function on<TEventType extends keyof TEventMap>(
    event: TEventType,
    handler: EventHandler<TEventMap[TEventType]>
  ): void {
    const handlers: EventHandler[] = subscribers[event] ?? [];

    handlers.push(handler as EventHandler);

    subscribers[event] = handlers;
  }

  function off<TEventType extends keyof TEventMap>(
    event: TEventType,
    handler: EventHandler<TEventMap[TEventType]>
  ): void {
    const handlers = subscribers[event];

    if (!handlers) {
      return;
    }

    subscribers[event] = handlers.filter(eventHandler => eventHandler !== handler);
  }

  function emit<TEventType extends keyof TEventMap>(
    event: TEventType,
    data: TEventMap[TEventType]
  ): void {
    subscribers[event]?.forEach(handler => handler(data as never));
  }

  function batchedEmit<TEventType extends keyof TEventMap>(
    event: TEventType,
    data: TEventMap[TEventType]
  ): void {
    // If events have been queued, update the data and short-circuit.
    if (queuedEvents.size > 0) {
      queuedEvents.set(event, data);

      return;
    }

    queuedEvents.set(event, data);

    setImmediate(function () {
      for (const [event, data] of queuedEvents) {
        emit(event, data);
      }

      queuedEvents.clear();
    });
  }

  return {
    batchedEmit,
    emit,
    off,
    on,
  };
};

export default createEventEmitter;
