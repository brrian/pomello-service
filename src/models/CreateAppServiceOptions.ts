import { AppContext } from './AppContext';
import { PomelloStatus } from './PomelloStatus';
import { State } from './State';

export interface CreateAppServiceOptions {
  onStateChange: (state: State<PomelloStatus, AppContext>) => void;
}
