const { nanoid } = require("nanoid");
const Timer = require("../models/Timer");

const TIMERS = [
  {
    start: Date.now(),
    description: "Timer 1",
    progress: 10000,
    isActive: true,
    id: nanoid(),
  },
  {
    start: Date.now() - 5000,
    end: Date.now() - 3000,
    duration: 2000,
    description: "Timer 0",
    isActive: false,
    id: nanoid(),
  },
];

class TimerService {
  timers() {
    return TIMERS;
  }

  createTimer(start, end, description, progress, isActive, id, duration) {
    const timer = new Timer(start, end, description, progress, isActive, id, duration);

    TIMERS.push(timer);

    return timer;
  }

  stopTimer(timer) {
    timer.isActive = false;
    timer.end = Date.now();
    timer.duration = Date.now() - timer.start;

    return timer;
  }
}

module.exports = TimerService;
