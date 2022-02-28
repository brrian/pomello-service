import { CancelWait } from './CancelWait';

export interface Ticker {
  start(tick: Tick): void;
  stop(): void;
  wait(callback: () => void, delay: number): CancelWait;
}

type Tick = () => void;
