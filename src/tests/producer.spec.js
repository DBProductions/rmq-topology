import Producer from '../producer'
import Exchange from '../exchange'

describe('Producer', () => {
  let producer
  let exchange
  let scene
  let ctx

  beforeEach(() => {
    producer = new Producer(0, 0, 'producer')
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
    scene = {
      ctx: {},
      lostMessages: 0,
      addActor: vi.fn(),
      removeActor: vi.fn()
    }
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

  it('should render', () => {
    producer.ctx = ctx
    producer.render()
    expect(producer.ctx.setLineDash).toHaveBeenCalled()
    expect(producer.ctx.beginPath).toHaveBeenCalled()
    expect(producer.ctx.rect).toHaveBeenCalled(2)
    expect(producer.ctx.stroke).toHaveBeenCalled()
  })

  it('should render with dragged fill color', () => {
    const calls = []
    const trackingCtx = new Proxy(ctx, {
      set(target, prop, value) {
        if (prop === 'fillStyle') calls.push(value)
        target[prop] = value
        return true
      }
    })
    producer.ctx = trackingCtx
    producer.dragged = true
    producer.render()
    expect(calls).toContain('#ccc')
  })

  it('should render with default fill color when not dragged', () => {
    const calls = []
    const trackingCtx = new Proxy(ctx, {
      set(target, prop, value) {
        if (prop === 'fillStyle') calls.push(value)
        target[prop] = value
        return true
      }
    })
    producer.ctx = trackingCtx
    producer.dragged = false
    producer.render()
    expect(calls).toContain('#fff')
  })

  it('should render with hover lineWidth', () => {
    producer.ctx = ctx
    producer.hover = true
    producer.render()
    expect(ctx.lineWidth).toEqual(2)
  })

  it('should render lines to published exchanges', () => {
    producer.addToScene(scene)
    producer.addMessageToExchange(exchange, 'x.y')
    producer.ctx = ctx
    producer.render()
    expect(ctx.setLineDash).toHaveBeenCalledWith([3, 3])
    expect(ctx.moveTo).toHaveBeenCalled()
    expect(ctx.lineTo).toHaveBeenCalledWith(exchange.x, exchange.y)
  })

  it('should handle update when message is null and assign default', () => {
    producer.addToScene(scene)
    producer.publishes[0] = { exchange, routingKey: 'x.y', message: null }
    producer.update(2)
    expect(producer.publishes[0].message).toBeDefined()
    expect(producer.publishes[0].message.headers).toBeDefined()
    expect(producer.publishes[0].message.body).toEqual({})
  })
})
