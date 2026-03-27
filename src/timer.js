class Timer {
  /**
   * Timer for a specific target to call update and render methods on every tick.
   *
   * @param {object} target
   */
  constructor(target) {
    this.running = false
    this.target = target
  }

  /**
   * Start the timer.
   */
  start() {
    this.running = true
    this.prevTime = +new Date() / 1000
    this.tick()
  }

  /**
   * Stop the timer.
   */
  stop() {
    if (this.running) {
      this.running = false
    }
  }

  /**
   * Tick of the timer.
   */
  tick() {
    const self = this
    self.tick = () => {
      if (self.running) {
        const curTime = +new Date() / 1000
        const dt = curTime - self.prevTime
        self.time += dt
        self.prevTime = curTime
        self.target.update(dt)
        self.target.render(dt)
        globalThis.requestAnimationFrame(self.tick)
      }
    }
    self.tick()
  }
}

export default Timer
