export interface Ticker {
  start: (tick: Tick) => void;
  stop: () => void;
}

type Tick = () => void;
