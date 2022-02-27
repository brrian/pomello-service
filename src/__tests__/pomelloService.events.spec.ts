import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service - Events', () => {
  it('should log the appInitialize event when setReady is called', () => {
    const { service } = mountPomelloService({
      initialize: false,
      settings: {
        set: ['task'],
      },
    });

    const handleAppInitialize = jest.fn();
    service.on('appInitialize', handleAppInitialize);

    service.setReady();

    expect(handleAppInitialize).toHaveBeenCalledTimes(1);
    expect(handleAppInitialize).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: null,
        timer: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskSelect event when selecting a task', () => {
    const { service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskSelect = jest.fn();

    service.on('taskSelect', handleTaskSelect);
    service.selectTask('TASK_ID');

    expect(handleTaskSelect).toHaveBeenCalledTimes(1);
    expect(handleTaskSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskSelect event when selecting a task after switching tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskSelect = jest.fn();

    service.on('taskSelect', handleTaskSelect);
    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.selectTask('TASK_ID_2');

    expect(handleTaskSelect).toHaveBeenCalledTimes(2);
    expect(handleTaskSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 10,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event when voiding a task while the timer is active', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskVoid = jest.fn();
    service.on('taskVoid', handleTaskVoid);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(8);
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 12,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event when voiding a task after the timer has ended', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
      },
    });

    const handleTaskVoid = jest.fn();
    service.on('taskVoid', handleTaskVoid);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerEnd event when the timer ends', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task', 'shortBreak', 'longBreak'],
        shortBreakTime: 8,
        longBreakTime: 18,
        taskTime: 20,
      },
    });

    const handleTimerEnd = jest.fn();
    service.on('timerEnd', handleTimerEnd);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.continueTask();
    advanceTimer();
    service.startTimer();
    advanceTimer();

    expect(handleTimerEnd).toHaveBeenCalledTimes(3);

    expect(handleTimerEnd).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 0,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );

    expect(handleTimerEnd).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 0,
          totalTime: 8,
          type: 'SHORT_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );

    expect(handleTimerEnd).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 0,
          totalTime: 18,
          type: 'LONG_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerPause event the timer is paused', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        taskTime: 20,
      },
    });

    const handleTimerPause = jest.fn();
    service.on('timerPause', handleTimerPause);

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);

    expect(handleTimerPause).toHaveBeenCalledTimes(1);
    expect(handleTimerPause).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_TIMER_ID',
        timer: {
          time: 10,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerResume event the timer is resumed', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        taskTime: 20,
      },
    });

    const handleTimerResume = jest.fn();
    service.on('timerResume', handleTimerResume);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);
    service.startTimer();

    expect(handleTimerResume).toHaveBeenCalledTimes(1);
    expect(handleTimerResume).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 10,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerSkip event when the timer is skipped', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak', 'longBreak'],
        shortBreakTime: 10,
      },
    });

    const handleTimerSkip = jest.fn();
    service.on('timerSkip', handleTimerSkip);

    service.startTimer();
    advanceTimer(5);
    service.skipTimer();

    expect(handleTimerSkip).toHaveBeenCalledTimes(1);
    expect(handleTimerSkip).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: null,
        timer: {
          time: 5,
          totalTime: 10,
          type: 'SHORT_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerStart event the timer starts', () => {
    const { service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTimerStart = jest.fn();

    service.on('timerStart', handleTimerStart);
    service.selectTask('TASK_TIMER_ID');
    service.startTimer();

    expect(handleTimerStart).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_TIMER_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerStart event for timers started automatically', async () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task', 'shortBreak'],
        shortBreakTime: 20,
        taskTime: 30,
      },
    });

    const handleTimerStart = jest.fn();
    service.on('timerStart', handleTimerStart);

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer();
    service.continueTask();

    expect(handleTimerStart).toHaveBeenCalledTimes(2);

    expect(handleTimerStart).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        taskId: 'TASK_TIMER_ID',
        timer: {
          time: 30,
          totalTime: 30,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );

    expect(handleTimerStart).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        taskId: 'TASK_TIMER_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'SHORT_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should not call the timerStart event when switching to a new task', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 30,
      },
    });

    const handleTimerStart = jest.fn();
    service.on('timerStart', handleTimerStart);

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(2);
    service.selectTask('NEW_TASK_ID');

    expect(handleTimerStart).toHaveBeenCalledTimes(1);
  });

  it('should call a timerStart event for injected timers', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        shortBreakTime: 10,
        taskTime: 20,
      },
    });

    const handleTimerStart = jest.fn();
    service.on('timerStart', handleTimerStart);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.voidTask();
    service.voidPromptHandled();

    expect(handleTimerStart).toHaveBeenCalledTimes(2);

    expect(handleTimerStart).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );

    expect(handleTimerStart).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 10,
          totalTime: 10,
          type: 'SHORT_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the timerTick event when the timer is ticked', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTimerTick = jest.fn();

    service.on('timerTick', handleTimerTick);
    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer(10);

    expect(handleTimerTick).toHaveBeenCalledTimes(10);
    expect(handleTimerTick).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_TIMER_ID',
        timer: {
          time: 10,
          totalTime: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should not log the timerTick event when the timer is paused', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTimerTick = jest.fn();
    service.on('timerTick', handleTimerTick);

    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer(10);
    service.pauseTimer();
    advanceTimer(30);

    expect(handleTimerTick).toHaveBeenCalledTimes(10);
  });
});
