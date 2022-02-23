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

  it('should transition to the short break state', () => {
    const { advanceTimer, attachUpdateHandler, service, waitForBatchedEvents } =
      mountPomelloService();

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
});
