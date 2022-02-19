import { PomelloSettings } from '../models';
import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service - Pomodoro Sets', () => {
  it('should throw an error for unknown set items', () => {
    const { service } = mountPomelloService({
      initialize: false,
      settings: { set: ['unknown'] } as unknown as PomelloSettings,
    });

    expect(() => service.setReady()).toThrowError('Unknown set item: "unknown"');
  });
});
