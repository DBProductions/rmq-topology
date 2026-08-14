import Queue from '../queue'
import Exchange from '../exchange'
import Consumer from '../consumer'
import BindingMessage from '../messages/bindingmessage'
import RejectMessage from '../messages/rejectmessage'

describe('Queue', () => {
  let queue
  let stream
  let exchange
  let consumer1
  let consumer2
  let consumer3
  let scene
  let ctx
  let binding

  beforeEach(() => {
    queue = new Queue(0, 0)
    stream = new Queue(0, 0, 'stream', 'stream')
    exchange = new Exchange(0, 0)
    scene = { lostMessages: 0, addActor: vi.fn(), removeActor: vi.fn() }
    consumer1 = new Consumer(0, 0)
    consumer2 = { id: 'consumer2' }
    consumer3 = { id: 'consumer3' }
    binding = { destination: { x: 0, y: 0 } }
    ctx = {
      beginPath: vi.fn(),
      strokeStyle: vi.fn(),
      setLineDash: vi.fn(),
      lineWidth: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      textAlign: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      rect: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn()
    }
  })

  it('should correctly add a consumer to the queue', () => {
    queue.addConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer1])
  })

  it('should not allow duplicate consumers', () => {
    queue.addConsumer(consumer1)
    queue.addConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer1])
  })

  it('should correctly add multiple consumers to the queue', () => {
    queue.addConsumer(consumer1)
    queue.addConsumer(consumer2)
    expect(queue.consumers).toEqual([consumer1, consumer2])
  })

  it('should correctly remove consumer from the queue', () => {
    queue.addConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer1])
    queue.removeConsumer(consumer1)
    expect(queue.consumers).toEqual([])

    queue.addConsumer(consumer1)
    queue.addConsumer(consumer2)
    expect(queue.consumers).toEqual([consumer1, consumer2])
    queue.removeConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer2])

    queue.addConsumer(consumer1)
    queue.addConsumer(consumer3)
    expect(queue.consumers).toEqual([consumer2, consumer1, consumer3])
    queue.removeConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer2, consumer3])
  })

  it('should correctly stay in the queue', () => {
    queue.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindMsg)
    expect(queue.messages.length).toEqual(1)
  })

  it('should correctly stay in the stream', () => {
    stream.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    stream.messageArrived(bindMsg)
    expect(stream.messages.length).toEqual(1)
  })

  it('should correctly stay in the stream when a consumer got added', () => {
    stream.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    stream.messageArrived(bindMsg)
    expect(stream.messages.length).toEqual(1)
    stream.addConsumer(consumer1)
    expect(stream.messages.length).toEqual(1)
  })

  it('replays retained messages to every joining consumer without mutating stored entries', () => {
    const addedActors = []
    scene.addActor = vi.fn((actor) => addedActors.push(actor))
    stream.addToScene(scene)
    const consumer2 = new Consumer(5, 5)
    const bindMsg = new BindingMessage(0, 0, binding)
    stream.messageArrived(bindMsg)
    stream.messageArrived(bindMsg)
    expect(stream.messages.length).toEqual(2)

    stream.addConsumer(consumer1)
    stream.addConsumer(consumer2)

    expect(
      addedActors.filter((actor) => actor.consumer === consumer1).length
    ).toEqual(2)
    expect(
      addedActors.filter((actor) => actor.consumer === consumer2).length
    ).toEqual(2)
    expect(stream.messages.every((m) => m.msg.consumer === null)).toBe(true)
    expect(stream.messages.length).toEqual(2)
  })

  it('should correctly stay in the queue until maximum length', () => {
    const maxLengthQueue = new Queue(0, 0, null, null, null, exchange, null, 2)
    maxLengthQueue.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    maxLengthQueue.messageArrived(bindMsg)
    maxLengthQueue.messageArrived(bindMsg)
    maxLengthQueue.messageArrived(bindMsg)
    expect(maxLengthQueue.messages.length).toEqual(2)
  })

  it('should correctly stay in the queue until a consumer got added', () => {
    queue.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindMsg)
    expect(queue.messages.length).toEqual(1)
    queue.addConsumer(consumer1)
    expect(queue.messages.length).toEqual(0)
  })

  it('should correctly route a message', () => {
    queue.addConsumer(consumer1)
    queue.addToScene(scene)
    const bindingMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindingMsg)
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(0)
  })

  it('should correctly remove a rejected message when no dlx exists', () => {
    queue.addConsumer(consumer1)
    queue.addToScene(scene)
    const rejectMsg = new RejectMessage(0, 0, queue)
    queue.messageArrived(rejectMsg)
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(1)
  })

  it('should correctly route a rejected message when dlx exists', () => {
    const dlxqueue = new Queue(0, 0, null, null, null, exchange)
    dlxqueue.addConsumer(consumer1)
    dlxqueue.addToScene(scene)
    const rejectMsg = new RejectMessage(0, 0, queue)
    dlxqueue.messageArrived(rejectMsg)
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(0)
  })

  it('should render', () => {
    queue.ctx = ctx
    queue.render()
    expect(queue.ctx.beginPath).toHaveBeenCalled(2)
    expect(queue.ctx.roundRect).toHaveBeenCalled(2)
    expect(queue.ctx.fill).toHaveBeenCalled()
  })

  it('should render with hover', () => {
    queue.ctx = ctx
    queue.hover = true
    queue.dragged = true
    queue.render()
    expect(queue.ctx.setLineDash).toHaveBeenCalled()
    expect(queue.ctx.beginPath).toHaveBeenCalled(2)
    expect(queue.ctx.roundRect).toHaveBeenCalled(2)
    expect(queue.ctx.stroke).toHaveBeenCalled()
    expect(queue.ctx.fill).toHaveBeenCalled()
  })

  it('should render with dlx', () => {
    queue.ctx = ctx
    queue.dlx = { x: 0, y: 0 }
    queue.render()
    expect(queue.ctx.beginPath).toHaveBeenCalled(3)
    expect(queue.ctx.roundRect).toHaveBeenCalled(2)
    expect(queue.ctx.stroke).toHaveBeenCalled()
    expect(queue.ctx.fill).toHaveBeenCalled()
  })

  it('should render stream type with different fill color', () => {
    const calls = []
    const trackingCtx = new Proxy(ctx, {
      set(target, prop, value) {
        if (prop === 'fillStyle') calls.push(value)
        target[prop] = value
        return true
      }
    })
    stream.ctx = trackingCtx
    stream.render()
    expect(calls).toContain('#eee')
  })

  it('should render with msgTtl label', () => {
    queue.ctx = ctx
    queue.msgTtl = 5000
    queue.render()
    expect(ctx.fillText).toHaveBeenCalledWith(
      'ttl: 5000',
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('should render with maxLength label', () => {
    queue.ctx = ctx
    queue.maxLength = 10
    queue.render()
    expect(ctx.fillText).toHaveBeenCalledWith(
      'max: 10',
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('should deliver stream messages to multiple consumers', () => {
    stream.addToScene(scene)
    const consumer2 = new Consumer(5, 5)
    const bindMsg = new BindingMessage(0, 0, binding)
    stream.addConsumer(consumer1)
    stream.addConsumer(consumer2)
    stream.messageArrived(bindMsg)
    expect(stream.messages.length).toBeGreaterThanOrEqual(1)
  })

  it('should deliver stream message to all consumers when message arrives', () => {
    stream.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    stream.messageArrived(bindMsg)
    stream.addConsumer(consumer1)
    stream.addConsumer(consumer2)
    const bindMsg2 = new BindingMessage(0, 0, binding)
    stream.messageArrived(bindMsg2)
    expect(stream.messages.length).toBeGreaterThanOrEqual(1)
  })

  it('should expire messages via update when msgTtl exceeded without DLX', () => {
    queue.addToScene(scene)
    queue.msgTtl = 1
    const bindMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindMsg)
    expect(queue.messages.length).toEqual(1)
    vi.useFakeTimers()
    vi.advanceTimersByTime(2000)
    queue.update()
    expect(queue.messages.length).toEqual(0)
    expect(scene.lostMessages).toEqual(1)
    vi.useRealTimers()
  })

  it('should expire messages via update when msgTtl exceeded with DLX', () => {
    const dlxQueue = new Queue(0, 0, null, null, null, exchange)
    dlxQueue.addToScene(scene)
    dlxQueue.msgTtl = 1
    const bindMsg = new BindingMessage(0, 0, { destination: { x: 0, y: 0 } })
    dlxQueue.messageArrived(bindMsg)
    expect(dlxQueue.messages.length).toEqual(1)
    vi.useFakeTimers()
    vi.advanceTimersByTime(2000)
    dlxQueue.update()
    expect(dlxQueue.messages.length).toEqual(0)
    expect(scene.removeActor).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('should not expire messages when msgTtl not exceeded', () => {
    queue.addToScene(scene)
    queue.msgTtl = 100000
    const bindMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindMsg)
    expect(queue.messages.length).toEqual(1)
    queue.update()
    expect(queue.messages.length).toEqual(1)
  })

  it('should not run TTL logic when msgTtl is empty', () => {
    queue.addToScene(scene)
    queue.msgTtl = ''
    const bindMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindMsg)
    queue.update()
    expect(queue.messages.length).toEqual(1)
  })
})
