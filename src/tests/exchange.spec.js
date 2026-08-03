import Exchange, { topicMatch } from '../exchange'
import Queue from '../queue'
import Binding from '../binding'
import ExchangeMessage from '../messages/exchangemessage'

describe('Exchange', () => {
  let exchange
  let queue
  let binding
  let msg1
  let msg2
  let scene
  let ctx

  beforeEach(() => {
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
    queue = new Queue(0, 0, 'q')
    binding = new Binding(exchange, queue, 'x')
    msg1 = new ExchangeMessage(0, 0, exchange, 'x', {}, false)
    msg2 = new ExchangeMessage(0, 0, exchange, 'q', {}, false)
    scene = { lostMessages: 0, addActor: vi.fn(), removeActor: vi.fn() }
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
      fill: vi.fn(),
      arc: vi.fn()
    }
  })

  it('should create an instance of Exchange with default values', () => {
    exchange.addToScene(scene)
    expect(exchange).toBeInstanceOf(Exchange)
    expect(exchange.x).toEqual(0)
    expect(exchange.y).toEqual(0)
    expect(exchange.name).toEqual('test-exchange')
    expect(exchange.type).toEqual('direct')
    expect(exchange.radius).toEqual(15)
    expect(exchange.alternate).toBeNull()
    expect(scene.addActor).toHaveBeenCalledTimes(1)
  })

  it('should remove binding correctly', () => {
    exchange.removeBinding(binding)
    expect(exchange.bindings).toEqual([])
  })

  it('should set the alternate exchange correctly', () => {
    const alternateExchange = new Exchange(1, 1, 'alt-exchange', 'direct')
    exchange.setAlternate(alternateExchange)
    expect(exchange.alternate).toEqual(alternateExchange)
  })

  it('should handle arriving messages on direct exchange', () => {
    exchange.addToScene(scene)
    exchange.messageArrived(msg1)
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    exchange.messageArrived(msg2)
    expect(scene.removeActor).toHaveBeenCalledTimes(2)
    expect(scene.lostMessages).toEqual(1)
  })

  it('should handle arriving messages on fanout exchange', () => {
    const fanout = new Exchange(0, 0, 'fanout-exchange', 'fanout')
    const fanoutBinding = new Binding(fanout, queue)
    fanout.addToScene(scene)
    fanout.messageArrived(msg1)
    expect(fanout.bindings).toEqual([fanoutBinding])
    expect(queue.bindings).toEqual([binding, fanoutBinding])
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(0)
  })

  it('should handle arriving messages on topic exchange', () => {
    const topic = new Exchange(0, 0, 'topic-exchange', 'topic')
    const topicBinding = new Binding(topic, queue, '#')
    topic.addToScene(scene)
    topic.messageArrived(msg1)
    expect(topic.bindings).toEqual([topicBinding])
    expect(queue.bindings).toEqual([binding, topicBinding])
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(0)
  })

  it('should handle arriving messages on exchange without binding', () => {
    exchange.removeBinding(binding)
    exchange.addToScene(scene)
    exchange.messageArrived(msg1)
    expect(exchange.bindings).toEqual([])
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(1)
  })

  it('should handle arriving messages on exchange without binding but alternate', () => {
    const alternateExchange = new Exchange(1, 1, 'alt-exchange', 'direct')
    exchange.setAlternate(alternateExchange)
    exchange.removeBinding(binding)
    exchange.addToScene(scene)
    exchange.messageArrived(msg1)
    expect(exchange.bindings).toEqual([])
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(0)
  })

  it('should render', () => {
    exchange.ctx = ctx
    exchange.render()
    expect(exchange.ctx.beginPath).toHaveBeenCalled()
    expect(exchange.ctx.fill).toHaveBeenCalled(2)
  })

  it('should render with hover', () => {
    exchange.ctx = ctx
    exchange.hover = true
    exchange.dragged = true
    exchange.render()
    expect(exchange.ctx.beginPath).toHaveBeenCalled()
    expect(exchange.ctx.fill).toHaveBeenCalled(2)
    expect(exchange.ctx.stroke).toHaveBeenCalled(2)
  })

  it('should render dashed line to alternate exchange', () => {
    const altExchange = new Exchange(50, 50, 'alt', 'direct')
    exchange.setAlternate(altExchange)
    exchange.ctx = ctx
    exchange.render()
    expect(ctx.beginPath).toHaveBeenCalled()
    expect(ctx.setLineDash).toHaveBeenCalledWith([3, 3])
    expect(ctx.moveTo).toHaveBeenCalledWith(exchange.x, exchange.y)
    expect(ctx.lineTo).toHaveBeenCalledWith(altExchange.x, altExchange.y)
  })

  it('should set this.binding to null when removing the active binding', () => {
    const exchange2 = new Exchange(0, 0, 'ex2', 'direct')
    const queue2 = new Queue(0, 0, 'q2')
    const binding2 = new Binding(exchange2, queue2, 'rk')
    exchange2.binding = binding2
    exchange2.removeBinding(binding2)
    expect(exchange2.binding).toBeNull()
  })

  it('should remove one binding while keeping others', () => {
    const queue2 = new Queue(0, 0, 'q2')
    const binding2 = new Binding(exchange, queue2, 'rk2')
    exchange.removeBinding(binding)
    expect(exchange.bindings).toContainEqual(binding2)
    expect(exchange.bindings).not.toContainEqual(binding)
  })
})

describe('topicMatch', () => {
  it('should match # wildcard with anything', () => {
    expect(topicMatch('#', 'x.y.z')).toBe(true)
    expect(topicMatch('#', '')).toBe(true)
  })

  it('should match a.# with a, a.b, a.b.c but not b', () => {
    expect(topicMatch('a.#', 'a')).toBe(true)
    expect(topicMatch('a.#', 'a.b')).toBe(true)
    expect(topicMatch('a.#', 'a.b.c')).toBe(true)
    expect(topicMatch('a.#', 'b')).toBe(false)
  })

  it('should match a.* with a.b but not a or a.b.c', () => {
    expect(topicMatch('a.*', 'a.b')).toBe(true)
    expect(topicMatch('a.*', 'a')).toBe(false)
    expect(topicMatch('a.*', 'a.b.c')).toBe(false)
  })

  it('should match *.b.* with a.b.c but not a.b', () => {
    expect(topicMatch('*.b.*', 'a.b.c')).toBe(true)
    expect(topicMatch('*.b.*', 'a.b')).toBe(false)
  })

  it('should match exact routing keys', () => {
    expect(topicMatch('a.b.c', 'a.b.c')).toBe(true)
    expect(topicMatch('a.b.c', 'a.b')).toBe(false)
  })

  it('should match * with single word but not empty routing key', () => {
    expect(topicMatch('*', 'x')).toBe(true)
    expect(topicMatch('*', '')).toBe(false)
    expect(topicMatch('*', 'x.y')).toBe(false)
  })

  it('should match empty routing key only with #', () => {
    expect(topicMatch('#', '')).toBe(true)
    expect(topicMatch('*', '')).toBe(false)
    expect(topicMatch('a', '')).toBe(false)
  })

  it('should return true when both bindingKey and routingKey are empty/null', () => {
    expect(topicMatch(null, null)).toBe(true)
    expect(topicMatch(undefined, undefined)).toBe(true)
    expect(topicMatch('', '')).toBe(true)
  })

  it('should return false when bindingKey is null/undefined but routingKey exists', () => {
    expect(topicMatch(null, 'a.b')).toBe(false)
    expect(topicMatch(undefined, 'a.b')).toBe(false)
  })

  it('should handle routingKey with fewer segments than bindingKey', () => {
    expect(topicMatch('a.b.c', 'a.b')).toBe(false)
  })
})
