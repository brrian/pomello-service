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
    const handleTimerStart = jest.fn();

    service.on('timerStart', handleTimerStart);
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

    expect(handleTimerStart).toHaveBeenCalledWith({
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

    const handleTimerTick = jest.fn();

    service.on('timerTick', handleTimerTick);
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

    expect(handleTimerTick).toHaveBeenCalledTimes(10);
    expect(handleTimerTick).toHaveBeenLastCalledWith({
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

    const handleTimerTick = jest.fn();
    const handleTimerPause = jest.fn();
    const handleServiceUpdate = attachUpdateHandler();

    service.on('timerPause', handleTimerPause);
    service.on('timerTick', handleTimerTick);

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

    expect(handleTimerTick).toHaveBeenCalledTimes(10);

    expect(handleTimerPause).toHaveBeenCalledTimes(1);
    expect(handleTimerPause).toHaveBeenLastCalledWith({
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

    const handleTimerTick = jest.fn();
    const handleTimerResume = jest.fn();
    const handleServiceUpdate = attachUpdateHandler();

    service.on('timerTick', handleTimerTick);
    service.on('timerResume', handleTimerResume);

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

    expect(handleTimerTick).toHaveBeenCalledTimes(15);

    expect(handleTimerResume).toHaveBeenCalledTimes(1);
    expect(handleTimerResume).toHaveBeenLastCalledWith({
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

  it('should automatically start a timer when continuing a task', async () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          shortBreakTime: 20,
        },
      });

    const handleTimerStart = jest.fn();
    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer();
    service.on('timerStart', handleTimerStart);
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

    expect(handleTimerStart).toHaveBeenCalledTimes(1);
    expect(handleTimerStart).toHaveBeenLastCalledWith({
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
});
