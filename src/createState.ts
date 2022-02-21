import { State } from './models';

interface CreateStateOptions<TStateValue extends string, TContext extends object> {
  initialState: TStateValue;
  context: TContext;
  onStateChange: (state: State<TStateValue, TContext>) => void;
}

export default function createState<TStateValue extends string, TContext extends object = never>({
  initialState,
  context,
  onStateChange,
}: CreateStateOptions<TStateValue, TContext>) {
  let state = {
    value: initialState,
    context: context,
  };

  function getState() {
    return state;
  }

  function setState(newStateValue: TStateValue | null, context?: TContext) {
    state = {
      value: newStateValue ?? state.value,
      context: context ?? state.context,
    };

    onStateChange(state);
  }

  return { getState, setState };
}
