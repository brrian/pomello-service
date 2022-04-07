import { CancelWait } from './CancelWait';

export type TickerWait = (callback: () => void, delay: number) => CancelWait;
