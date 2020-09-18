const Timer = class Timer {
  constructor(start, end, description, progress, isActive, id, duration) {
    this.start = start;
    this.end = end;
    this.description = description;
    this.progress = progress;
    this.isActive = isActive;
    this.id = id;
    this.duration = duration;
  }
};

module.exports = Timer;
