import { CancelWait } from './CancelWait';
export interface Ticker {
    start(tick: Tick): void;
    stop(): void;
    wait(callback: () => void, delay: number): CancelWait;
}
declare type Tick = () => void;
export {};
//# sourceMappingURL=Ticker.d.ts.map