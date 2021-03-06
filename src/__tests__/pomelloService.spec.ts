import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service', () => {
  it('should initialize without errors', () => {
    const { service } = mountPomelloService({ initialize: false });

    expect(service.getState().status).toEqual('INITIALIZING');
  });

  it('should transition to the select task state', () => {
    const { service } = mountPomelloService({ initialize: false });

    service.setReady();

    expect(service.getState().status).toEqual('SELECT_TASK');
  });

  it('should transition to the task state', () => {
    const { attachUpdateHandler, service, waitForBatchedEvents } = mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject({
      status: 'TASK',
      currentTaskId: 'TASK_ID',
    });

    expect(handleServiceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'TASK',
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it('should transition to the task timer end state', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject({
      status: 'TASK_TIMER_END_PROMPT',
      currentTaskId: 'TASK_ID',
    });

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'TASK_TIMER_END_PROMPT',
        currentTaskId: 'TASK_ID',
        timer: null,
      })
    );
  });

  it('should transition to after continuing a task', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'shortBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.taskTimerEndPromptHandled('continueTask');
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it('should transition after selecting a new task', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'longBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.taskTimerEndPromptHandled('switchTask');
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'LONG_BREAK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'LONG_BREAK',
        currentTaskId: null,
      })
    );
  });

  it('should be able to switch tasks', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task'],
          taskTime: 30,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SELECT_TASK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'SELECT_TASK',
        currentTaskId: null,
      })
    );

    service.selectTask('TASK_ID_2');
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'TASK',
        currentTaskId: 'TASK_ID_2',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'TASK',
        currentTaskId: 'TASK_ID_2',
      })
    );
  });

  it('should transition after skipping the timer', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['shortBreak', 'task'],
          shortBreakTime: 30,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.startTimer();
    advanceTimer(10);
    service.skipTimer();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SELECT_TASK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'SELECT_TASK',
        currentTaskId: null,
      })
    );
  });

  it('should transition after completing a task', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task'],
          taskTime: 30,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'TASK_COMPLETE_PROMPT',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'TASK_COMPLETE_PROMPT',
        currentTaskId: 'TASK_ID',
      })
    );

    advanceTimer(2);
    service.taskCompleteHandled();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SELECT_TASK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'SELECT_TASK',
        currentTaskId: null,
      })
    );
  });

  it('should not transition during the task completed prompt when the timer ends', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'shortBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();
    advanceTimer();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'TASK_COMPLETE_PROMPT',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'TASK_COMPLETE_PROMPT',
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it('should transition after the task completed prompt has been handled after the timer has ended', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'shortBreak'],
          taskTime: 30,
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.completeTask();
    advanceTimer();
    service.taskCompleteHandled();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: null,
      })
    );
  });

  it('should transition after voiding a task when the timer has ended', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'shortBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.voidTask();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'TASK_VOID_PROMPT',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'TASK_VOID_PROMPT',
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it('should transition to a short break after handling a void prompt', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'shortBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.voidTask();
    service.voidPromptHandled();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it("should repeat the task after a voided tasks's injected short break has ended", () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'longBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.taskTimerEndPromptHandled('voidTask');
    service.voidPromptHandled();
    advanceTimer();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'TASK',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'TASK',
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it('should transition during select task when the timer has ended', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService({
        settings: {
          set: ['task', 'longBreak'],
        },
      });

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer(10);
    service.switchTask();
    advanceTimer();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'LONG_BREAK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'LONG_BREAK',
        currentTaskId: null,
      })
    );
  });

  it('should update the settings', () => {
    const { advanceTimer, service, settings } = mountPomelloService({
      settings: {
        set: ['task', 'shortBreak'],
        shortBreakTime: 30,
      },
    });

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.updateSettings({ ...settings, shortBreakTime: 10 });
    service.taskTimerEndPromptHandled('continueTask');

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        status: 'SHORT_BREAK',
        currentTaskId: 'TASK_ID',
        timer: expect.objectContaining({
          time: 10,
          totalTime: 10,
        }),
      })
    );
  });
});
