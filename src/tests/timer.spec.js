import Timer from '../timer'

describe('Timer', () => {
  let timer
  let targetMock

  beforeEach(() => {
    targetMock = { update: vi.fn(), render: vi.fn() }
    timer = new Timer(targetMock)
  })

  it('should start the timer', () => {
    timer.start()
    expect(timer.running).toBeTruthy()
  })

  it('should stop the timer', () => {
    timer.start()
    expect(timer.running).toBeTruthy()
    timer.stop()
    expect(timer.running).toBeFalsy()
  })

  it('should stay stopped when stopped twice', () => {
    timer.stop()
    expect(timer.running).toBeFalsy()
  })

  it('should not update the target when the timer is not running', () => {
    timer.tick()
    expect(targetMock.update).not.toHaveBeenCalled()
    expect(targetMock.render).not.toHaveBeenCalled()
  })

  it('should call update and render methods on every tick', () => {
    vi.useFakeTimers()
    timer.start()
    try {
      vi.runAllTimers()
    } catch (error) {
      expect(targetMock.update).toHaveBeenCalledTimes(10001)
      expect(targetMock.render).toHaveBeenCalledTimes(10001)
    }
  })
})
