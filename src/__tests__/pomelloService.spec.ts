import { PomelloStateValue } from '../models';
import mountPomelloService from '../__fixtures__/mountPomelloService';

describe('Pomello Service', () => {
  it('should initialize without errors', () => {
    const { service } = mountPomelloService({ initialize: false });

    expect(service.getState().value).toEqual(PomelloStateValue.initializing);
  });

  it('should transition to the select task state', () => {
    const { service } = mountPomelloService({ initialize: false });

    const handleAppInitialize = jest.fn();
    service.on('appInitialize', handleAppInitialize);

    service.setReady();

    expect(service.getState().value).toEqual(PomelloStateValue.selectTask);

    expect(handleAppInitialize).toHaveBeenCalledTimes(1);
    expect(handleAppInitialize).toHaveBeenCalledWith({
      value: PomelloStateValue.selectTask,
      currentTaskId: null,
      timer: null,
    });
  });

  it('should transition to the task state', () => {
    const { attachUpdateHandler, service } = mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();
    const handleTaskSelect = jest.fn();

    service.on('taskSelect', handleTaskSelect);
    service.selectTask('TASK_ID');

    expect(service.getState()).toMatchObject({
      value: PomelloStateValue.task,
      currentTaskId: 'TASK_ID',
    });

    expect(handleServiceUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        value: PomelloStateValue.task,
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleTaskSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        value: PomelloStateValue.task,
        currentTaskId: 'TASK_ID',
      })
    );
  });

  it('should transition to the task timer end state', () => {
    const { advanceTimer, attachUpdateHandler, service } = mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();

    advanceTimer();

    expect(service.getState()).toMatchObject({
      value: PomelloStateValue.taskTimerEndPrompt,
      currentTaskId: 'TASK_ID',
    });

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: PomelloStateValue.taskTimerEndPrompt,
        currentTaskId: 'TASK_ID',
        timer: null,
      })
    );
  });

  it('should transition to the short break state', () => {
    const { advanceTimer, attachUpdateHandler, service } = mountPomelloService();

    const handleServiceUpdate = attachUpdateHandler();

    service.selectTask('TASK_ID');
    service.startTimer();
    advanceTimer();
    service.continueTask();

    expect(service.getState()).toMatchObject(
      expect.objectContaining({
        value: PomelloStateValue.shortBreak,
        currentTaskId: 'TASK_ID',
      })
    );

    expect(handleServiceUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: PomelloStateValue.shortBreak,
        currentTaskId: 'TASK_ID',
      })
    );
  });
});
