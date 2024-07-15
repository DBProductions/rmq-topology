import Queue from '../queue'
import Exchange from '../exchange'
import Consumer from '../consumer'
import BindingMessage from '../messages/bindingmessage'
import RejectMessage from '../messages/rejectmessage'

describe('Queue', () => {
  let queue
  let exchange
  let consumer1
  let consumer2
  let scene
  let ctx
  let binding

  beforeEach(() => {
    queue = new Queue(0, 0)
    exchange = new Exchange(0, 0)
    scene = { lostMessages: 0, addActor: vi.fn(), removeActor: vi.fn() }
    consumer1 = new Consumer(0, 0)
    consumer2 = { id: 'consumer2' }
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

  it('should correctly remove a consumer from the queue', () => {
    queue.addConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer1])
    queue.removeConsumer(consumer1)
    expect(queue.consumers).toEqual([])
  })

  it('should correctly remove a consumer from the queue', () => {
    queue.addConsumer(consumer1)
    queue.addConsumer(consumer2)
    expect(queue.consumers).toEqual([consumer1, consumer2])
    queue.removeConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer2])
  })

  it('should correctly stay in the queue', () => {
    queue.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    queue.messageArrived(bindMsg)
    expect(queue.messages.length).toEqual(1)
  })

  it('should correctly stay in the queue until maximum length', () => {
    const maxLengthQueue = new Queue(0, 0, null, null, exchange, null, 2)
    maxLengthQueue.addToScene(scene)
    const bindMsg = new BindingMessage(0, 0, binding)
    maxLengthQueue.messageArrived(bindMsg)
    maxLengthQueue.messageArrived(bindMsg)
    maxLengthQueue.messageArrived(bindMsg)
    expect(maxLengthQueue.messages.length).toEqual(2 )
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
    const dlxqueue = new Queue(0, 0, null, null, exchange)
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
    queue.dlx = {x: 0, y: 0}
    queue.render()
    expect(queue.ctx.beginPath).toHaveBeenCalled(3)
    expect(queue.ctx.roundRect).toHaveBeenCalled(2)
    expect(queue.ctx.stroke).toHaveBeenCalled()
    expect(queue.ctx.fill).toHaveBeenCalled()
  })
})
