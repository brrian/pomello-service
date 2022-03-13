declare type EventMap = Record<string, unknown>;
declare type EventHandler<TData = never> = (data: TData) => void;
declare const createEventEmitter: <TEventMap extends EventMap>() => {
    batchedEmit: <TEventType extends keyof TEventMap>(event: TEventType, data: TEventMap[TEventType]) => void;
    emit: <TEventType_1 extends keyof TEventMap>(event: TEventType_1, data: TEventMap[TEventType_1]) => void;
    off: <TEventType_2 extends keyof TEventMap>(event: TEventType_2, handler: EventHandler<TEventMap[TEventType_2]>) => void;
    on: <TEventType_3 extends keyof TEventMap>(event: TEventType_3, handler: EventHandler<TEventMap[TEventType_3]>) => void;
};
export default createEventEmitter;
//# sourceMappingURL=createEventEmitter.d.ts.map