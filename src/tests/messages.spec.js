import ExchangeMessage from '../messages/exchangemessage'
import BindingMessage from '../messages/bindingmessage'
import QueueMessage from '../messages/queuemessage'
import RejectMessage from '../messages/rejectmessage'
import BaseMessage from '../messages/basemessage'
import AlternateMessage from '../messages/alternatemessage'

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

describe('BaseMessage', () => {
  it('should render a circle on the canvas', () => {
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn()
    }
    const msg = new BaseMessage(10, 20, 5, '#ff0000')
    msg.ctx = ctx
    msg.render()
    expect(ctx.beginPath).toHaveBeenCalled()
    expect(ctx.arc).toHaveBeenCalledWith(10, 20, 5, 0, 2 * Math.PI)
    expect(ctx.fill).toHaveBeenCalled()
  })

  it('should use default radius and fillStyle', () => {
    const msg = new BaseMessage(0, 0)
    expect(msg.radius).toEqual(3)
    expect(msg.fillStyle).toEqual('#c82124')
    expect(msg.thrust).toEqual(5)
  })

  it('should move toward target and call onArrival', () => {
    const msg = new BaseMessage(0, 0)
    const onArrival = vi.fn()
    msg.moveToTarget(0, 0, onArrival)
    expect(onArrival).toHaveBeenCalled()
  })

  it('should move toward target incrementally when far away', () => {
    const msg = new BaseMessage(0, 0)
    const onArrival = vi.fn()
    msg.moveToTarget(100, 100, onArrival)
    expect(msg.x).toBeGreaterThan(0)
    expect(msg.y).toBeGreaterThan(0)
    expect(onArrival).not.toHaveBeenCalled()
  })
})

describe('AlternateMessage', () => {
  it('should move toward target exchange and call messageArrived', () => {
    const exchange = { x: 0, y: 0, messageArrived: vi.fn() }
    const msg = new AlternateMessage(0, 0, exchange, 'rk', '#ff0000')
    msg.update()
    expect(exchange.messageArrived).toHaveBeenCalledWith(msg)
  })

  it('should move toward target when far away', () => {
    const exchange = { x: 100, y: 100, messageArrived: vi.fn() }
    const msg = new AlternateMessage(0, 0, exchange, 'rk', '#ff0000')
    msg.update()
    expect(msg.x).toBeGreaterThan(0)
    expect(msg.y).toBeGreaterThan(0)
    expect(exchange.messageArrived).not.toHaveBeenCalled()
  })

  it('should set target from exchange coordinates', () => {
    const exchange = { x: 50, y: 60, messageArrived: vi.fn() }
    const msg = new AlternateMessage(0, 0, exchange, 'rk')
    expect(msg.targetX).toEqual(50)
    expect(msg.targetY).toEqual(60)
  })
})
