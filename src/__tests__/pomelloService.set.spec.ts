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

  it('should support sets with no tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak', 'longBreak'],
        shortBreakTime: 8,
        longBreakTime: 16,
      },
    });

    expect(service.getState()).toMatchObject({
      currentTaskId: null,
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 8,
        totalTime: 8,
        type: 'SHORT_BREAK',
      },
      value: 'SHORT_BREAK',
    });

    service.startTimer();
    advanceTimer();

    expect(service.getState()).toMatchObject({
      currentTaskId: null,
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 16,
        totalTime: 16,
        type: 'LONG_BREAK',
      },
      value: 'LONG_BREAK',
    });
  });

  it('should support sets with only tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 8,
      },
    });

    service.selectTask('TASK_ID');

    expect(service.getState()).toMatchObject({
      currentTaskId: 'TASK_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 8,
        totalTime: 8,
        type: 'TASK',
      },
      value: 'TASK',
    });

    service.startTimer();
    advanceTimer();
    service.continueTask();

    expect(service.getState()).toMatchObject({
      currentTaskId: 'TASK_ID',
      timer: {
        isActive: true,
        isInjected: false,
        isPaused: false,
        time: 8,
        totalTime: 8,
        type: 'TASK',
      },
      value: 'TASK',
    });

    advanceTimer();
    service.selectNewTask();
    service.selectTask('NEW_TASK_ID');

    expect(service.getState()).toMatchObject({
      currentTaskId: 'NEW_TASK_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 8,
        totalTime: 8,
        type: 'TASK',
      },
      value: 'TASK',
    });
  });

  it('should support sets that start with breaks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak', 'task'],
        shortBreakTime: 8,
        taskTime: 16,
      },
    });

    expect(service.getState()).toMatchObject({
      currentTaskId: null,
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 8,
        totalTime: 8,
        type: 'SHORT_BREAK',
      },
      value: 'SHORT_BREAK',
    });

    service.startTimer();
    advanceTimer();

    expect(service.getState()).toMatchObject({
      currentTaskId: null,
      timer: null,
      value: 'SELECT_TASK',
    });

    service.selectTask('TASK_ID');

    expect(service.getState()).toMatchObject({
      currentTaskId: 'TASK_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 16,
        totalTime: 16,
        type: 'TASK',
      },
      value: 'TASK',
    });
  });

  it('should support sets that start and end with breaks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        longBreakTime: 15,
        set: ['shortBreak', 'task', 'longBreak'],
        shortBreakTime: 5,
        taskTime: 20,
      },
    });

    expect(service.getState()).toMatchObject({
      currentTaskId: null,
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 5,
        totalTime: 5,
        type: 'SHORT_BREAK',
      },
      value: 'SHORT_BREAK',
    });

    service.startTimer();
    advanceTimer();

    expect(service.getState()).toMatchObject({
      currentTaskId: null,
      timer: null,
      value: 'SELECT_TASK',
    });

    service.selectTask('TASK_ID');

    expect(service.getState()).toMatchObject({
      currentTaskId: 'TASK_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 20,
        totalTime: 20,
        type: 'TASK',
      },
      value: 'TASK',
    });

    service.startTimer();
    advanceTimer();
    service.continueTask();

    expect(service.getState()).toMatchObject({
      currentTaskId: 'TASK_ID',
      timer: {
        isActive: true,
        isInjected: false,
        isPaused: false,
        time: 15,
        totalTime: 15,
        type: 'LONG_BREAK',
      },
      value: 'LONG_BREAK',
    });

    advanceTimer();

    expect(service.getState()).toMatchObject({
      currentTaskId: 'TASK_ID',
      timer: {
        isActive: false,
        isInjected: false,
        isPaused: false,
        time: 5,
        totalTime: 5,
        type: 'SHORT_BREAK',
      },
      value: 'SHORT_BREAK',
    });
  });
});
