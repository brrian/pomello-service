import { TimerType } from '../models';
import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service - Timers', () => {
  it('should create a task timer when a task is selected', () => {
    const { attachUpdateHandler, service, waitForBatchedEvents } = mountPomelloService({
      settings: {
        taskTime: 999,
      },
    });

    const handleServiceUpdate = attachUpdateHandler();
    service.selectTask('TASK_TIMER_ID');
    waitForBatchedEvents();

    expect(service.getState().timer).toMatchObject({
      isActive: false,
      isInjected: false,
      isPaused: false,
      time: 999,
      totalTime: 999,
      type: TimerType.task,
    });

    expect(handleServiceUpdate).toHaveBeenCalledWith({
      value: 'TASK',
      currentTaskId: 'TASK_TIMER_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 999,
        totalTime: 999,
        type: TimerType.task,
      },
    });
  });

  it('should activate the timer when started', () => {
    const { attachUpdateHandler, service, waitForBatchedEvents } = mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    waitForBatchedEvents();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 30,
      totalTime: 30,
      type: TimerType.task,
    });

    expect(handleServiceUpdate).toHaveBeenCalledWith({
      value: 'TASK',
      currentTaskId: 'TASK_TIMER_ID',
      timer: {
        isActive: true,
        isInjected: false,
        isPaused: false,
        time: 30,
        totalTime: 30,
        type: TimerType.task,
      },
    });
  });

  it('should tick the timer when active', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          taskTime: 20,
        },
      });

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    waitForBatchedEvents();

    const handleServiceUpdate = attachUpdateHandler();

    advanceTimer(10);

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 10,
      totalTime: 20,
      type: TimerType.task,
    });

    expect(handleServiceUpdate).toHaveBeenCalledTimes(10);
    expect(handleServiceUpdate).toHaveBeenLastCalledWith({
      value: 'TASK',
      currentTaskId: 'TASK_TIMER_ID',
      timer: {
        isActive: true,
        isInjected: false,
        isPaused: false,
        time: 10,
        totalTime: 20,
        type: TimerType.task,
      },
    });
  });

  it('should pause an active timer', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          taskTime: 20,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);
    waitForBatchedEvents();

    expect(service.getState().timer).toMatchObject({
      isActive: false,
      isInjected: false,
      isPaused: true,
      time: 10,
      totalTime: 20,
      type: TimerType.task,
    });

    expect(handleServiceUpdate).toHaveBeenLastCalledWith({
      value: 'TASK',
      currentTaskId: 'TASK_TIMER_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: true,
        time: 10,
        totalTime: 20,
        type: TimerType.task,
      },
    });
  });

  it('should resume a paused timer', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          taskTime: 20,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);
    service.startTimer();
    advanceTimer(5);
    waitForBatchedEvents();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 5,
      totalTime: 20,
      type: TimerType.task,
    });

    expect(handleServiceUpdate).toHaveBeenLastCalledWith({
      value: 'TASK',
      currentTaskId: 'TASK_TIMER_ID',
      timer: {
        isActive: true,
        isInjected: false,
        isPaused: false,
        time: 5,
        totalTime: 20,
        type: TimerType.task,
      },
    });
  });

  it('should automatically start a timer when continuing a task', async () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          shortBreakTime: 20,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer();
    service.continueTask();
    waitForBatchedEvents();

    expect(service.getState().timer).toMatchObject({
      isActive: true,
      isInjected: false,
      isPaused: false,
      time: 20,
      totalTime: 20,
      type: TimerType.shortBreak,
    });

    expect(handleServiceUpdate).toHaveBeenLastCalledWith({
      value: 'SHORT_BREAK',
      currentTaskId: 'TASK_TIMER_ID',
      timer: {
        isActive: true,
        isInjected: false,
        isPaused: false,
        time: 20,
        totalTime: 20,
        type: TimerType.shortBreak,
      },
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
