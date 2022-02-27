import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service - Overtime', () => {
  it('should start overtime when task timer exceeds the overtimeDelay', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        overtimeDelay: 10,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    advanceTimer(9);

    expect(service.getState().overtime).toBe(null);

    advanceTimer(1);

    expect(service.getState().overtime).toMatchObject({
      time: 10,
      type: 'TASK',
    });
  });
});
