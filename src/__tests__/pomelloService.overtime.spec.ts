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
      taskId: 'TASK_ID',
      time: 10,
      type: 'TASK',
    });
  });

  it('should not enter overtime if the next timer starts within overtimeDelay', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        overtimeDelay: 10,
        set: ['task', 'shortBreak'],
        shortBreakTime: 20,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    advanceTimer(9);

    expect(service.getState().overtime).toBe(null);

    service.taskTimerEndPromptHandled('continueTask');
    advanceTimer(10);

    expect(service.getState().overtime).toBe(null);
  });

  it('should tick the overtime timer when active', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak'],
        overtimeDelay: 10,
      },
    });

    service.startTimer();
    advanceTimer();
    advanceTimer(20);

    expect(service.getState().overtime).toMatchObject({
      taskId: null,
      time: 20,
      type: 'SHORT_BREAK',
    });
  });

  it('should end overtime when the next timer starts', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task', 'shortBreak'],
        overtimeDelay: 10,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    advanceTimer(15);
    service.taskTimerEndPromptHandled('continueTask');

    expect(service.getState().overtime).toBe(null);
  });
});
