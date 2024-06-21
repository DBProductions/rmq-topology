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
    timer.stop()
    expect(timer.running).toBeFalsy()
  })

  it('should call update and render methods on every tick', () => {
    vi.useFakeTimers()
    timer.start()
    vi.runAllTimers()
    expect(targetMock.update).toHaveBeenCalledTimes(1)
    expect(targetMock.render).toHaveBeenCalledTimes(1)
  })
})
