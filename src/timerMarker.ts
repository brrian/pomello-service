import { Timer } from './models';

interface Marker {
  time: number;
  timestamp: number;
}

const timerMarker = () => {
  let marker: Marker | null = null;

  const getMarker = (gracePeriod: number): Marker | null => {
    const timestamp = new Date().getTime();

    const gracePeriodInMs = gracePeriod * 1000;

    if (marker && timestamp - marker.timestamp > gracePeriodInMs) {
      unsetMarker();
    }

    return marker;
  };

  const setMarker = (timer: Timer | null): void => {
    if (timer) {
      marker = {
        time: timer.time,
        timestamp: new Date().getTime(),
      };
    }
  };

  const unsetMarker = (): void => {
    marker = null;
  };

  return {
    getMarker,
    setMarker,
    unsetMarker,
  };
};

export default timerMarker;
