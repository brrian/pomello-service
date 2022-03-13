import { State } from './models';
interface CreateStateOptions<TStateValue extends string, TContext extends object> {
    initialState: TStateValue;
    context: TContext;
    onStateChange: (state: State<TStateValue, TContext>) => void;
}
declare const createState: <TStateValue extends string, TContext extends object = never>({ initialState, context, onStateChange, }: CreateStateOptions<TStateValue, TContext>) => {
    getState: () => {
        value: TStateValue;
        context: TContext;
    };
    setState: (newStateValue: TStateValue | null, context?: TContext | undefined) => void;
};
export default createState;
//# sourceMappingURL=createState.d.ts.map