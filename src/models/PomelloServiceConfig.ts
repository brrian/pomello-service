import { PomelloSettings } from './PomelloSettings';
import { Ticker } from './Ticker';

export interface PomelloServiceConfig {
  createTicker: () => Ticker;
  settings: PomelloSettings;
}
