export declare type EventObject<TType extends string, TPayload = never> = [TPayload] extends [never] ? {
    type: TType;
} : {
    type: TType;
    payload: TPayload;
};
//# sourceMappingURL=EventObject.d.ts.map