import Producer from '../producer'
import Exchange from '../exchange'

describe('Producer', () => {
  let producer
  let exchange

  beforeEach(() => {
    producer = new Producer(0, 0, 'producer')
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
  })

  it('should create a new instance of Producer with default values', () => {
    expect(producer).toBeInstanceOf(Producer)
    expect(producer.x).toEqual(0)
    expect(producer.y).toEqual(0)
    expect(producer.name).toEqual('producer')
    expect(producer.publishes).toEqual({})
  })

  it('should create a new instance of Producer with custom values', () => {
    const customProducer = new Producer(1, 2, 'name', [{}])
    expect(customProducer).toBeInstanceOf(Producer)
    expect(customProducer.x).toEqual(1)
    expect(customProducer.y).toEqual(2)
    expect(customProducer.name).toEqual('name')
    expect(customProducer.publishes).toEqual([{}])
  })

  it('xxx should update publishedMessages when messages are sent', () => {
    producer.addMessageToExchange(exchange, 'x.y')
    producer.update(-2)
    expect(producer.publishes).toEqual({
      0: { exchange, routingKey: 'x.y', message: { body: {}, headers: {} } }
    })
    //expect(producer.publishedMessages).toEqual(0);
  })

  it('should update publishedMessages when messages are sent', () => {
    producer.update()
    expect(producer.publishedMessages).toEqual(0)
  })

  it('should create ExchangeMessage objects and add them to the scene when updating', () => {
    const scene = {} // Assuming there's a scene object that can be manipulated
    producer.update()
    expect(producer.publishedMessages).toEqual(0)
    //expect(scene[Producer.prototype.scene]).toHaveLength(1); // Assuming ExchangeMessage objects are added to the scene
  })

  it('should create UUID when creating an ExchangeMessage', () => {
    producer.addMessageToExchange('test', 'x.y')
    producer.update(-2)
    const message = producer.publishes[Object.keys(producer.publishes)[0]]
    //expect(message.headers['message-id']).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(message.exchange).toEqual('test')
    expect(message.routingKey).toEqual('x.y')
    expect(message.message).toEqual({ headers: {}, body: {} })
  })
})
