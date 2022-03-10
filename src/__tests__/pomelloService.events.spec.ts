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
        overtime: null,
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
        timer: null,
        overtime: null,
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
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskStart event when the task timer starts', () => {
    const { service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskStart = jest.fn();
    service.on('taskStart', handleTaskStart);

    service.selectTask('TASK_ID');
    service.startTimer();

    expect(handleTaskStart).toHaveBeenCalledTimes(1);
    expect(handleTaskStart).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskStart event after switching tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskStart = jest.fn();
    service.on('taskStart', handleTaskStart);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(1);
    service.selectTask('TASK_ID_2');

    expect(handleTaskStart).toHaveBeenCalledTimes(2);
    expect(handleTaskStart).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 9,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should not log the task start event on non-task timers', () => {
    const { service } = mountPomelloService({
      settings: {
        set: ['shortBreak'],
      },
    });

    const handleTaskStart = jest.fn();
    service.on('taskStart', handleTaskStart);

    service.startTimer();

    expect(handleTaskStart).not.toHaveBeenCalled();
  });

  it('should log the taskEnd event when the task timer ends', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskEnd = jest.fn();
    service.on('taskEnd', handleTaskEnd);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();

    expect(handleTaskEnd).toHaveBeenCalledTimes(1);
    expect(handleTaskEnd).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 0,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskEnd event when switching tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskEnd = jest.fn();
    service.on('taskEnd', handleTaskEnd);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(2);
    service.selectTask('TASK_ID_2');

    expect(handleTaskEnd).toHaveBeenCalledTimes(1);
    expect(handleTaskEnd).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 10,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskEndEvent when completing a task', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskEnd = jest.fn();
    service.on('taskEnd', handleTaskEnd);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();

    expect(handleTaskEnd).toHaveBeenCalledTimes(1);
    expect(handleTaskEnd).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 10,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should not log the taskEnd event when a non-task timer ends', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak'],
      },
    });

    const handleTaskEnd = jest.fn();
    service.on('taskEnd', handleTaskEnd);

    service.startTimer();
    advanceTimer();

    expect(handleTaskEnd).not.toHaveBeenCalled();
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
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a task after the timer has ended', () => {
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
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a new task after switching and after the timer has ended', () => {
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
    advanceTimer(15);
    service.switchTask();
    service.selectTask('TASK_ID_2');
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 5,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a new task after completing a task and after the timer has ended', () => {
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
    advanceTimer(15);
    service.completeTask();
    service.taskCompleteHandled();
    service.selectTask('TASK_ID_2');
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 5,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a new task after switching within the grace period and after the timer has ended', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 5,
        set: ['task'],
        taskTime: 20,
      },
    });

    jest.setSystemTime(0);

    const handleTaskVoid = jest.fn();
    service.on('taskVoid', handleTaskVoid);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(15);
    service.switchTask();
    advanceTimer(4);
    service.selectTask('TASK_ID_2');
    advanceTimer();
    advanceTimer(3);
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 5,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: 20000,
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a new task after completing a task within the grace period and after the timer has ended', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 5,
        set: ['task'],
        taskTime: 20,
      },
    });

    const handleTaskVoid = jest.fn();
    service.on('taskVoid', handleTaskVoid);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(15);
    service.completeTask();
    service.taskCompleteHandled();
    advanceTimer(4);
    service.selectTask('TASK_ID_2');
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 5,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a new task after switching outside the grace period and after the timer has ended', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 5,
        set: ['task'],
        taskTime: 30,
      },
    });

    const handleTaskVoid = jest.fn();
    service.on('taskVoid', handleTaskVoid);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(6);
    service.selectTask('TASK_ID_2');
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 14,
          totalTime: 30,
          type: 'TASK',
        },
        overtime: null,
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the taskVoid event with the previous timer when voiding a new task after completing a task outside the grace period and after the timer has ended', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 5,
        set: ['task'],
        taskTime: 30,
      },
    });

    const handleTaskVoid = jest.fn();
    service.on('taskVoid', handleTaskVoid);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();
    service.taskCompleteHandled();
    advanceTimer(6);
    service.selectTask('TASK_ID_2');
    advanceTimer();
    service.voidTask();

    expect(handleTaskVoid).toHaveBeenCalledTimes(1);
    expect(handleTaskVoid).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID_2',
        timer: {
          time: 14,
          totalTime: 30,
          type: 'TASK',
        },
        overtime: null,
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
    service.taskTimerEndPromptHandled('continueTask');
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
    service.taskTimerEndPromptHandled('continueTask');

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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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
        overtime: null,
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

  it('should log the overtimeStart event when overtime starts', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task'],
        overtimeDelay: 10,
        taskTime: 20,
      },
    });

    jest.setSystemTime(0);

    const handleOvertimeStart = jest.fn();

    service.on('overtimeStart', handleOvertimeStart);
    service.selectTask('TASK_TIMER_ID');
    service.startTimer();
    advanceTimer();
    advanceTimer(10);

    expect(handleOvertimeStart).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_TIMER_ID',
        timer: null,
        overtime: {
          taskId: 'TASK_TIMER_ID',
          time: 0,
          type: 'TASK',
        },
        timestamp: 20000,
      })
    );
  });

  it('should log the overtimeTick event when the overtime timer ticks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['longBreak', 'task'],
        overtimeDelay: 10,
      },
    });

    const handleOvertimeTick = jest.fn();

    service.on('overtimeTick', handleOvertimeTick);
    service.startTimer();
    advanceTimer();
    advanceTimer(20);

    expect(handleOvertimeTick).toHaveBeenCalledTimes(10);
    expect(handleOvertimeTick).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: null,
        timer: null,
        overtime: {
          taskId: null,
          time: 20,
          type: 'LONG_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the overtimeEnd event when overtime ends', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak', 'task'],
        overtimeDelay: 10,
      },
    });

    const handleOvertimeEnd = jest.fn();

    service.on('overtimeEnd', handleOvertimeEnd);
    service.startTimer();
    advanceTimer();
    advanceTimer(20);
    service.startTimer();

    expect(handleOvertimeEnd).toHaveBeenCalledTimes(1);
    expect(handleOvertimeEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: null,
        timer: null,
        overtime: {
          taskId: null,
          time: 20,
          type: 'SHORT_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the overtimeEnd event with the taskId after switching tasks', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['task', 'shortBreak'],
        shortBreakTime: 10,
        overtimeDelay: 10,
      },
    });

    const handleOvertimeEnd = jest.fn();
    service.on('overtimeEnd', handleOvertimeEnd);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    advanceTimer(20);
    service.taskTimerEndPromptHandled('switchTask');

    expect(handleOvertimeEnd).toHaveBeenCalledTimes(1);
    expect(handleOvertimeEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: null,
        timer: {
          time: 10,
          totalTime: 10,
          type: 'SHORT_BREAK',
        },
        overtime: {
          taskId: 'TASK_ID',
          time: 20,
          type: 'TASK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should log the overtimeEnd event without the taskId after selecting a new task', () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        set: ['shortBreak', 'task'],
        overtimeDelay: 10,
        taskTime: 20,
      },
    });

    const handleOvertimeEnd = jest.fn();
    service.on('overtimeEnd', handleOvertimeEnd);

    service.startTimer();
    advanceTimer();
    advanceTimer(20);
    service.selectTask('TASK_ID');
    service.startTimer();

    expect(handleOvertimeEnd).toHaveBeenCalledTimes(1);
    expect(handleOvertimeEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: 'TASK_ID',
        timer: {
          time: 20,
          totalTime: 20,
          type: 'TASK',
        },
        overtime: {
          taskId: null,
          time: 20,
          type: 'SHORT_BREAK',
        },
        timestamp: expect.any(Number),
      })
    );
  });

  it("should log a switched task's start time with the previous task's end time if within the grace period", () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 10,
        set: ['task'],
        taskTime: 30,
      },
    });

    jest.setSystemTime(0);

    const handleTaskStart = jest.fn();
    service.on('taskStart', handleTaskStart);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(9);
    service.selectTask('NEW_TASK_ID');

    expect(handleTaskStart).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'NEW_TASK_ID',
        timer: {
          time: 20,
          totalTime: 30,
          type: 'TASK',
        },
        overtime: null,
        timestamp: 10000,
      })
    );
  });

  it("should log a new task's start time with the previously completed task's end time if within the grace period", () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 10,
        set: ['task'],
        taskTime: 30,
      },
    });

    jest.setSystemTime(0);

    const handleTaskStart = jest.fn();
    service.on('taskStart', handleTaskStart);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();
    service.taskCompleteHandled();
    advanceTimer(9);
    service.selectTask('NEW_TASK_ID');

    expect(handleTaskStart).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'NEW_TASK_ID',
        timer: {
          time: 20,
          totalTime: 30,
          type: 'TASK',
        },
        overtime: null,
        timestamp: 10000,
      })
    );
  });

  it("should not log a switched task's start time with the previous task's end time if outside the grace period", () => {
    const { advanceTimer, service } = mountPomelloService({
      settings: {
        betweenTasksGracePeriod: 5,
        set: ['task'],
        taskTime: 30,
      },
    });

    jest.setSystemTime(0);

    const handleTaskStart = jest.fn();
    service.on('taskStart', handleTaskStart);

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer(6);
    service.selectTask('NEW_TASK_ID');

    expect(handleTaskStart).toHaveBeenLastCalledWith(
      expect.objectContaining({
        taskId: 'NEW_TASK_ID',
        timer: {
          time: 14,
          totalTime: 30,
          type: 'TASK',
        },
        overtime: null,
        timestamp: 16000,
      })
    );
  });
});
