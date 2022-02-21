export interface State<TStateValue extends string, TContext extends object> {
  value: TStateValue;
  context: TContext;
}
