import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service', () => {
  it('should initialize without errors', () => {
    const { service } = mountPomelloService({ initialize: false });

    expect(service.getState().value).toEqual('INITIALIZING');
  });

  it('should transition to the select task state', () => {
    const { service } = mountPomelloService({ initialize: false });

    const handleAppInitialize = jest.fn();
    service.on('appInitialize', handleAppInitialize);

    service.setReady();

    expect(service.getState().value).toEqual('SELECT_TASK');

    expect(handleAppInitialize).toHaveBeenCalledTimes(1);
    expect(handleAppInitialize).toHaveBeenCalledWith({
      value: 'SELECT_TASK',
      currentTaskId: null,
      timer: null,
    });
  });

  it('should transition to the task state', () => {
    const { attachUpdateHandler, service, waitForBatchedEvents } = mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();
    const handleTaskSelect = jest.fn();

    service.on('taskSelect', handleTaskSelect);
    service.selectTask('TASK_ID');
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject({
      value: 'TASK',
      currentTaskId: 'TASK_ID',
    });

    expect(handleServiceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'TASK',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleTaskSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'TASK',
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
      value: 'TASK_TIMER_END_PROMPT',
      currentTaskId: 'TASK_ID',
    });

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'TASK_TIMER_END_PROMPT',
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
    service.continueTask();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        value: 'SHORT_BREAK',
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'SHORT_BREAK',
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
    service.selectNewTask();
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        value: 'LONG_BREAK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'LONG_BREAK',
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
        value: 'SELECT_TASK',
        currentTaskId: null,
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'SELECT_TASK',
        currentTaskId: null,
      })
    );

    service.selectTask('TASK_ID_2');
    waitForBatchedEvents();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        value: 'TASK',
        currentTaskId: 'TASK_ID_2',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'TASK',
        currentTaskId: 'TASK_ID_2',
      })
    );
  });
});
