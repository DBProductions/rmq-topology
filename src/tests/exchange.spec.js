import Exchange from '../exchange'
import BaseComponent from '../basecomponent'
import BindingMessage from '../messages/bindingmessage'
import AlternateMessage from '../messages/alternatemessage'

describe('Exchange', () => {
  let exchange, scene

  beforeEach(() => {
    exchange = new Exchange(0, 0, 'test-exchange', 'direct')
    scene = { addToScene: vi.fn() }
  })

  // Happy path test case
  it('should create an instance of Exchange with default values', () => {
    expect(exchange).toBeInstanceOf(Exchange)
    expect(exchange.x).toEqual(0)
    expect(exchange.y).toEqual(0)
    expect(exchange.name).toEqual('test-exchange')
    expect(exchange.type).toEqual('direct')
    expect(exchange.radius).toEqual(15)
    expect(exchange.bindings).toEqual([])
    expect(exchange.alternate).toBeNull()
  })

  // Test setAlternate method
  it('should set the alternate exchange correctly', () => {
    const alternateExchange = new Exchange(1, 1, 'alt-exchange', 'direct')
    exchange.setAlternate(alternateExchange)
    expect(exchange.alternate).toEqual(alternateExchange)
  })
})
