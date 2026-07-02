import ExchangeMessage from '../messages/exchangemessage'
import BindingMessage from '../messages/bindingmessage'
import QueueMessage from '../messages/queuemessage'
import RejectMessage from '../messages/rejectmessage'

describe('message movement', () => {
  it('should move ExchangeMessage toward target', () => {
    const exchange = { x: 100, y: 100, messageArrived: vi.fn() }
    const msg = new ExchangeMessage(0, 0, exchange, 'rk', {})
    msg.update()
    expect(msg.x).toBeGreaterThan(0)
    expect(msg.y).toBeGreaterThan(0)
  })

  it('should call messageArrived when ExchangeMessage reaches target', () => {
    const exchange = { x: 0, y: 0, messageArrived: vi.fn() }
    const msg = new ExchangeMessage(0, 0, exchange, 'rk', {})
    msg.scene = { removeActor: vi.fn() }
    msg.update()
    expect(exchange.messageArrived).toHaveBeenCalledWith(msg)
  })

  it('should move BindingMessage toward target', () => {
    const binding = { destination: { x: 100, y: 100, messageArrived: vi.fn() } }
    const msg = new BindingMessage(0, 0, binding)
    msg.update()
    expect(msg.x).toBeGreaterThan(0)
    expect(msg.y).toBeGreaterThan(0)
  })

  it('should call messageArrived when BindingMessage reaches target', () => {
    const destination = { x: 0, y: 0, messageArrived: vi.fn() }
    const binding = { destination }
    const msg = new BindingMessage(0, 0, binding)
    msg.update()
    expect(destination.messageArrived).toHaveBeenCalledWith(msg)
  })

  it('should move QueueMessage toward consumer', () => {
    const consumer = { x: 100, y: 100, width: 30, height: 30 }
    const queue = {}
    const msg = new QueueMessage(0, 0, queue, consumer)
    msg.update()
    expect(msg.x).toBeGreaterThan(0)
    expect(msg.y).toBeGreaterThan(0)
  })

  it('should call messageArrived when QueueMessage reaches consumer', () => {
    const consumer = {
      x: -15,
      y: -15,
      width: 30,
      height: 30,
      messageArrived: vi.fn()
    }
    const queue = {}
    const msg = new QueueMessage(0, 0, queue, consumer)
    msg.update()
    expect(consumer.messageArrived).toHaveBeenCalledWith(msg)
  })

  it('should not move QueueMessage without a consumer', () => {
    const queue = {}
    const msg = new QueueMessage(0, 0, queue, null)
    msg.update()
    expect(msg.x).toEqual(0)
    expect(msg.y).toEqual(0)
  })

  it('should move RejectMessage toward queue', () => {
    const queue = { x: 100, y: 100, messageArrived: vi.fn() }
    const msg = new RejectMessage(0, 0, queue)
    msg.update()
    expect(msg.x).toBeGreaterThan(0)
    expect(msg.y).toBeGreaterThan(0)
  })

  it('should call messageArrived when RejectMessage reaches queue', () => {
    const queue = { x: 0, y: 0, messageArrived: vi.fn() }
    const msg = new RejectMessage(0, 0, queue)
    msg.update()
    expect(queue.messageArrived).toHaveBeenCalledWith(msg)
  })

  it('should not move RejectMessage without a queue', () => {
    const msg = new RejectMessage(0, 0, null)
    msg.update()
    expect(msg.x).toEqual(0)
    expect(msg.y).toEqual(0)
  })
})
