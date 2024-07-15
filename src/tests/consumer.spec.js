import Consumer from '../consumer'
import Queue from '../queue'
import QueueMessage from '../messages/queuemessage'

describe('Consumer', () => {
  let consumer
  let queue
  let qm
  let scene
  let ctx

  beforeEach(() => {
    consumer = new Consumer(0, 0)
    queue = new Queue(1, 1)
    scene = { lostMessages: 0, addActor: vi.fn(), removeActor: vi.fn() }
    qm = new QueueMessage(0, 0, queue, consumer)
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
      fill: vi.fn()
    }
  })

  it('should create a new Consumer with default values', () => {
    expect(consumer.x).toBe(0)
    expect(consumer.y).toBe(0)
    expect(consumer.name).toBeUndefined()
    expect(consumer.mode).toBe('ack')
    expect(consumer.arrivedMessages).toBe(0)
    expect(consumer.width).toBe(30)
    expect(consumer.height).toBe(30)
  })

  it('should add a queue to the list', () => {
    consumer.addQueue(queue)
    expect(consumer.queues.length).toBe(1)
    expect(consumer.queues[0]).toEqual(queue)
  })

  it('should add a queue to the list but not twice', () => {
    consumer.addQueue(queue)
    consumer.addQueue(queue)
    expect(consumer.queues.length).toBe(1)
    expect(consumer.queues[0]).toEqual(queue)
  })

  it('should remove a queue from the list', () => {
    consumer.addQueue(queue)
    consumer.removeQueue(queue)
    expect(consumer.queues.length).toBe(0)
  })

  it('should handle arriving messages', () => {
    consumer.addToScene(scene)
    consumer.messageArrived(qm)
    expect(consumer.arrivedMessages).toBe(1)
  })

  it('should render', () => {
    consumer.ctx = ctx
    consumer.render()
    expect(consumer.ctx.setLineDash).toHaveBeenCalled()
    expect(consumer.ctx.beginPath).toHaveBeenCalled()
    expect(consumer.ctx.rect).toHaveBeenCalled(2)
    expect(consumer.ctx.stroke).toHaveBeenCalled()
    expect(consumer.ctx.fill).toHaveBeenCalled()
  })

  it('should render with hover', () => {
    consumer.ctx = ctx
    consumer.hover = true
    consumer.dragged = true    
    consumer.render()
    expect(consumer.ctx.setLineDash).toHaveBeenCalled()
    expect(consumer.ctx.beginPath).toHaveBeenCalled()
    expect(consumer.ctx.rect).toHaveBeenCalled(2)
    expect(consumer.ctx.lineWidth).toEqual(2)
    expect(consumer.ctx.stroke).toHaveBeenCalled()
    expect(consumer.ctx.fill).toHaveBeenCalled()
  })
})
