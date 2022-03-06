/* globals createPomelloService */
let interval = 1000;

function setValue(id, value) {
  document.getElementById(id).textContent = value ?? '';
}

const logPomelloEvent = (type, action, event) => {
  let message = type.replace('_', ' ');

  if (type === 'TASK') {
    message += ` (${event.taskId})`;
  }

  message += ` ${action}`;

  const color =
    type === 'TASK'
      ? '#f34235'
      : type === 'SHORT_BREAK'
      ? '#2095f2'
      : type === 'LONG_BREAK'
      ? '#4bae4f'
      : '#00c2c1';

  console.group(`%c${message} ▼`, `color: ${color}`);

  console.log(JSON.stringify(event, null, 2));

  console.groupEnd();
};

const createTicker = () => {
  let tickId = null;
  let waitId = null;

  const start = tick => {
    let expected = Date.now() + interval;

    const step = () => {
      const drift = Date.now() - expected;
      const newTimeout = Math.max(0, interval - drift);

      expected += interval;

      tick();

      if (tickId) {
        tickId = window.setTimeout(step, newTimeout);
      }
    };

    tickId = window.setTimeout(step, interval);
  };

  const stop = () => {
    if (tickId) {
      window.clearTimeout(tickId);

      tickId = null;
    }
  };

  const wait = (callback, delay) => {
    waitId = setTimeout(callback, delay * interval);

    return () => {
      clearTimeout(waitId);
    };
  };

  return { start, stop, wait };
};

const pomello = createPomelloService({
  createTicker,
  settings: {
    betweenTasksGracePeriod: 5,
    longBreakTime: 8,
    overtimeDelay: 10,
    set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
    shortBreakTime: 5,
    taskTime: 10,
  },
});

pomello.setReady();

pomello.on('update', ({ value, currentTaskId, timer, overtime }) => {
  document.body.dataset.appState = value;

  setValue('app-state', value);
  setValue('current-task', currentTaskId);

  const timerState = !timer ? null : timer.isActive ? 'ACTIVE' : timer.isPaused ? 'PAUSED' : 'IDLE';

  if (timerState) {
    document.body.dataset.timerState = timerState;
  } else {
    delete document.body.dataset.timerState;
  }

  setValue('timer-state', timerState);
  setValue('timer-type', timer?.type);
  setValue('timer-time', timer?.time);

  setValue('overtime-type', overtime?.type);
  setValue('overtime-time', overtime?.time);
});

pomello.on('taskSelect', event => logPomelloEvent('TASK', 'selected', event));
pomello.on('taskStart', event => logPomelloEvent('TASK', 'started', event));
pomello.on('taskEnd', event => logPomelloEvent('TASK', 'ended', event));
pomello.on('taskVoid', event => logPomelloEvent('TASK', 'voided', event));

pomello.on('timerStart', event => {
  if (event.timer.type !== 'TASK') {
    logPomelloEvent(event.timer.type, 'started', event);
  }
});

pomello.on('timerEnd', event => {
  if (event.timer.type !== 'TASK') {
    logPomelloEvent(event.timer.type, 'ended', event);
  }
});

pomello.on('timerSkip', event => {
  if (event.timer.type !== 'TASK') {
    logPomelloEvent(event.timer.type, 'ended', event);
  }
});

pomello.on('timerPause', event => {
  logPomelloEvent(event.timer.type, 'paused', event);
});

pomello.on('timerResume', event => {
  logPomelloEvent(event.timer.type, 'resumed', event);
});

pomello.on('overtimeStart', event => {
  logPomelloEvent(event.overtime.type, 'OVERTIME started', event);
});

pomello.on('overtimeEnd', event => {
  logPomelloEvent(event.overtime.type, 'OVERTIME ended', event);
});

document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', () => {
    const parameters = button.dataset.parameters?.split(',') ?? [];

    pomello[button.dataset.action](...parameters);
  });
});

document.querySelectorAll('[data-speed]').forEach(button => {
  button.addEventListener('click', () => {
    interval = parseInt(button.dataset.speed, 10);
  });
});
