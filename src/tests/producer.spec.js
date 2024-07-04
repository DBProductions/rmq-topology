import Producer from '../producer'
import Exchange from '../exchange'

describe('Producer', () => {
  let producer
  let exchange
  let scene

  beforeEach(() => {
    producer = new Producer(0, 0, 'producer')
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
    scene = {
      ctx: {},
      lostMessages: 0,
      addActor: vi.fn(),
      removeActor: vi.fn()
    }
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

  it('should add message to exchange but only unique', () => {
    producer.addToScene(scene)
    producer.addMessageToExchange(exchange, 'x.y')
    producer.addMessageToExchange(exchange, 'x.y')
    producer.addMessageToExchange(exchange, 'x.y.z')
    producer.update(2)
    expect(producer.publishes[0].exchange).toEqual(exchange)
    expect(producer.publishes[0].routingKey).toEqual('x.y')
    expect(producer.publishes[1].exchange).toEqual(exchange)
    expect(producer.publishes[1].routingKey).toEqual('x.y.z')
  })

  it('should update publishedMessages when messages are sent', () => {
    producer.addToScene(scene)
    producer.addMessageToExchange(exchange, 'x.y')
    producer.update(2)
    expect(producer.publishedMessages).toEqual(1)
  })

  it('should not update publishedMessages when messages are not sent', () => {
    producer.addToScene(scene)
    producer.update(1) // spawn time is 1.5
    expect(producer.publishedMessages).toEqual(0)
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

  it('should remove the specified exchange from the object', () => {
    producer.publishes = {
      exchange1: { exchange: 'exchange1' },
      exchange2: { exchange: 'exchange2' },
      exchange3: { exchange: 'exchange3' }
    }
    const exchangeToRemove = 'exchange1'
    producer.removeExchange(exchangeToRemove)
    expect(producer.publishes[exchangeToRemove]).toBeUndefined()
  })

  it('should not remove any exchange if the specified exchange does not exist', () => {
    producer.publishes = {
      exchange1: { exchange: 'exchange1' },
      exchange2: { exchange: 'exchange2' },
      exchange3: { exchange: 'exchange3' }
    }
    const nonExistingExchange = 'nonExistingExchange'
    producer.removeExchange(nonExistingExchange)
    expect(producer.publishes[nonExistingExchange]).toEqual(
      producer.publishes[nonExistingExchange]
    )
  })
})
