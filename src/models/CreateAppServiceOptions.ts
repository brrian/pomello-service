import { AppContext } from './AppContext';
import { AppState } from './AppState';
import { State } from './State';

export interface CreateAppServiceOptions {
  onStateChange: (state: State<AppState, AppContext>) => void;
}
