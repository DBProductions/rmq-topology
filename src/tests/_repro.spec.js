import Scene from '../scene'
import Exchange from '../exchange'
import Queue from '../queue'
import Binding from '../binding'
import Consumer from '../consumer'
import Producer from '../producer'
import { render } from '../utils/consumerDisplay'

const makeCtx = () =>
  new Proxy(
    {},
    {
      get: (t, p) => {
        if (p in t) return t[p]
        return () => {}
      },
      set: (t, p, v) => {
        t[p] = v
        return true
      }
    }
  )

describe('consumer display repro', () => {
  it('logs arriving messages and renders them inline', () => {
    document.body.innerHTML = `
      <input type="checkbox" id="consumerShowMessagesToggle" checked>
      <input type="hidden" id="consumerIdField">
      <div id="consumerMsgInlineWrap" style="display: none;">
        <textarea id="consumerMsgInline"></textarea>
      </div>`

    const scene = new Scene(makeCtx(), 1000, 500)
    globalThis.scene = scene
    const exchange = new Exchange(100, 100, 'ex', 'fanout')
    exchange.addToScene(scene)
    const queue = new Queue(200, 100, 'q', 'quorum')
    queue.addToScene(scene)
    new Binding(exchange, queue, 'rk').addToScene(scene)
    const consumer = new Consumer(300, 100, 'c', [], 'ack')
    consumer.addQueue(queue)
    consumer.displayMessages = true
    consumer.addToScene(scene)
    document.querySelector('#consumerIdField').value = consumer.id
    const producer = new Producer(0, 100, 'p')
    producer.addMessageToExchange(exchange, 'rk', {
      headers: {},
      body: { hello: 'world' }
    })
    producer.addToScene(scene)

    producer.update(2)
    for (let i = 0; i < 500; i += 1) scene.update(0.1)

    expect(consumer.messageLog.length).toBeGreaterThan(0)
    render()
    expect(document.querySelector('#consumerMsgInlineWrap').style.display).toBe(
      'block'
    )
    const value = document.querySelector('#consumerMsgInline').value
    expect(value).toContain('hello')
    expect(value).toContain('exchange ex')
    expect(value).toContain('rk rk')
    expect(value).toContain('queue q')
  })
})
