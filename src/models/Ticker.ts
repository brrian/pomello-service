export interface Ticker {
  start(tick: Tick): void;
  stop(): void;
  wait(callback: () => void, delay: number): CancelWait;
}

type CancelWait = () => void;

type Tick = () => void;
