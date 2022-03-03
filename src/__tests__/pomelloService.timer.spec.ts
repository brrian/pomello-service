import { TimerType } from '../models';
import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service - Timers', () => {
  it('should create a task timer when a task is selected', () => {
    const { service } = mountPomelloService({
      settings: {
        taskTime: 999,
      },
    });

    service.selectTask('TASK_TIMER_ID');

    expect(service.getState().timer).toMatchObject({
      isActive: false,
      isInjected: false,
      isPaused: false,
      time: 999,
      totalTime: 999,
      type: TimerType.task,
    });
  });

  it('should activate the timer when started', () => {
    const { service } = mountPomelloService();

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 30,
      totalTime: 30,
      type: TimerType.task,
    });
  });

  it('should tick the timer when active', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        taskTime: 20,
      },
    });

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    advanceTimer(10);

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 10,
      totalTime: 20,
      type: TimerType.task,
    });
  });

  it('should pause an active timer', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        taskTime: 20,
      },
    });

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);

    expect(service.getState().timer).toMatchObject({
      isActive: false,
      isInjected: false,
      isPaused: true,
      time: 10,
      totalTime: 20,
      type: TimerType.task,
    });
  });

  it('should resume a paused timer', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        taskTime: 20,
      },
    });

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);
    service.startTimer();
    advanceTimer(5);

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 5,
      totalTime: 20,
      type: TimerType.task,
    });
  });

  it('should automatically start a timer when continuing a task', async () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        shortBreakTime: 20,
      },
    });

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer();
    service.taskTimerEndPromptHandled('continueTask');

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 20,
      totalTime: 20,
      type: TimerType.shortBreak,
    });
  });

  it('should use the existing task timer when switching tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 30,
      },
    });

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(2);
    service.selectTask('NEW_TASK_ID');

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 18,
      totalTime: 30,
      type: TimerType.task,
    });
  });

  it('should destroy the timer when skipped', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        longBreakTime: 15,
        set: ['shortBreak', 'longBreak'],
        shortBreakTime: 10,
      },
    });

    service.startTimer();
    advanceTimer(5);
    service.skipTimer();

    expect(service.getState().timer).toMatchObject({
      isActive: false,
      isInjected: false,
      isPaused: false,
      time: 15,
      totalTime: 15,
      type: TimerType.longBreak,
    });
  });

  it('should use the existing task timer when completing a task', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 30,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 20,
      totalTime: 30,
      type: TimerType.task,
    });

    advanceTimer(2);
    service.taskCompleteHandled();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 18,
      totalTime: 30,
      type: TimerType.task,
    });
  });

  it('should destroy the timer when a task is voided', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 30,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.voidTask();

    expect(service.getState().timer).toBeNull();
  });

  it('should inject a short break after handling a void prompt', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        shortBreakTime: 10,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.voidTask();
    service.voidPromptHandled();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: true,
      isPaused: false,
      time: 10,
      totalTime: 10,
      type: TimerType.shortBreak,
    });
  });
});
