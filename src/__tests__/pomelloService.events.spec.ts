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
});
