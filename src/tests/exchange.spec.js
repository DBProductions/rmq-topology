import Exchange from '../exchange'
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

  beforeEach(() => {
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
    queue = new Queue(0, 0, 'q')
    binding = new Binding(exchange, queue, 'x')
    msg1 = new ExchangeMessage(0, 0, exchange, 'x', {}, false)
    msg2 = new ExchangeMessage(0, 0, exchange, 'q', {}, false)
    scene = { lostMessages: 0, addActor: vi.fn(), removeActor: vi.fn() }
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

  it('should handle arriving messages on exchange without binding and alternate', () => {
    const alternateExchange = new Exchange(1, 1, 'alt-exchange', 'direct')
    exchange.setAlternate(alternateExchange)
    exchange.removeBinding(binding)    
    exchange.addToScene(scene)
    exchange.messageArrived(msg1)
    expect(exchange.bindings).toEqual([])
    expect(scene.removeActor).toHaveBeenCalledTimes(1)
    expect(scene.lostMessages).toEqual(0)
  })
})
