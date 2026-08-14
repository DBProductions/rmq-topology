import { beforeEach, describe, expect, it } from 'vitest'
import {
  exportAsyncApi,
  exportCurl,
  exportRabbitmqadmin,
  exportTerraform,
  exportTopology
} from '../utils/exports'
import { brokerDefaultSettings, setSettings } from '../utils/settings'

const evt = { preventDefault: () => {}, stopPropagation: () => {} }

const dom = {
  ImExport: { value: '' },
  imexportPanel: { classList: { add: () => {}, remove: () => {} } },
  importBtn: { classList: { add: () => {}, remove: () => {} } }
}

const factory = {
  exchange: (opts = {}) => ({
    id: 'e1',
    x: 400,
    y: 150,
    name: 'Orders',
    type: 'direct',
    alternate: null,
    bindings: [],
    ...opts
  }),
  queue: (opts = {}) => ({
    id: 'q1',
    x: 650,
    y: 150,
    name: 'Order Queue',
    type: 'quorum',
    ttl: '',
    msgTtl: '',
    maxLength: '',
    dlx: undefined,
    dlxrk: '',
    ...opts
  }),
  binding: (opts = {}) => ({
    id: 'b1',
    source: null,
    destination: null,
    routingKey: '',
    ...opts
  }),
  consumer: (opts = {}) => ({
    id: 'c1',
    x: 800,
    y: 150,
    name: 'Consumer',
    queues: [],
    mode: 'ack',
    ...opts
  }),
  producer: (opts = {}) => ({
    id: 'p1',
    x: 200,
    y: 150,
    name: 'Producer',
    publishes: {},
    ...opts
  })
}

const setScene = ({
  exchanges = [],
  queues = [],
  bindings = [],
  consumers = [],
  producers = []
} = {}) => {
  globalThis.scene = {
    getObjectsInScene: (type) =>
      ({
        Exchange: exchanges,
        Queue: queues,
        Binding: bindings,
        Consumer: consumers,
        Producer: producers
      })[type] || []
  }
}

const fullTopology = () => {
  const exchange = factory.exchange()
  const alternate = factory.exchange({
    id: 'e2',
    name: 'Orders-alt',
    type: 'fanout'
  })
  exchange.alternate = alternate
  const queue = factory.queue({ msgTtl: '60000', maxLength: '10' })
  queue.dlx = exchange
  queue.dlxrk = 'dead'
  const binding = factory.binding({
    source: exchange,
    destination: queue,
    routingKey: 'order.created'
  })
  const consumer = factory.consumer({ queues: [queue], mode: 'reject' })
  const producer = factory.producer({
    publishes: {
      0: {
        exchange,
        routingKey: 'order.created',
        message: { headers: {}, body: {} }
      }
    }
  })
  setScene({
    exchanges: [exchange, alternate],
    queues: [queue],
    bindings: [binding],
    consumers: [consumer],
    producers: [producer]
  })
  return { exchange, alternate, queue, binding, consumer, producer }
}

beforeEach(() => {
  setSettings(brokerDefaultSettings)
  dom.ImExport.value = ''
  const realQuerySelector = document.querySelector.bind(document)
  document.querySelector = (selector) => {
    if (selector === '#ImExport') return dom.ImExport
    if (selector === '#imexportPanel') return dom.imexportPanel
    if (selector === '#importBtn') return dom.importBtn
    return realQuerySelector(selector)
  }
})

describe('exportTopology', () => {
  it('exports an empty topology', () => {
    setScene()
    exportTopology(evt)
    expect(JSON.parse(dom.ImExport.value)).toEqual({
      description: '',
      producers: [],
      consumers: [],
      exchanges: [],
      queues: [],
      bindings: []
    })
  })

  it('exports the full topology with indices and names', () => {
    fullTopology()
    exportTopology(evt)
    const out = JSON.parse(dom.ImExport.value)

    expect(out.exchanges).toEqual([
      {
        x: 400,
        y: 150,
        name: 'Orders',
        type: 'direct',
        alternate: 'Orders-alt'
      },
      { x: 400, y: 150, name: 'Orders-alt', type: 'fanout', alternate: null }
    ])
    expect(out.queues).toEqual([
      {
        x: 650,
        y: 150,
        name: 'Order Queue',
        type: 'quorum',
        ttl: '60000',
        maxLength: '10',
        dlx: 0
      }
    ])
    expect(out.bindings).toEqual([
      { exchange: 0, queue: 0, routingKey: 'order.created' }
    ])
    expect(out.consumers).toEqual([
      { x: 800, y: 150, name: 'Consumer', consumes: [0], mode: 'reject' }
    ])
    expect(out.producers[0].name).toBe('Producer')
    expect(out.producers[0].publishes['0']).toEqual({
      exchange: 'Orders',
      routingKey: 'order.created',
      message: { headers: {}, body: {} }
    })
  })

  it('skips bindings that reference actors missing from the scene', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    const binding = factory.binding({ source: exchange, destination: queue })
    setScene({ exchanges: [exchange], bindings: [binding] })
    exportTopology(evt)
    const out = JSON.parse(dom.ImExport.value)
    expect(out.bindings).toEqual([])
  })

  it('omits dlx for queues without a dead letter exchange', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    setScene({ exchanges: [exchange], queues: [queue] })
    exportTopology(evt)
    const out = JSON.parse(dom.ImExport.value)
    expect(out.queues[0]).not.toHaveProperty('dlx')
  })
})

describe('exportCurl', () => {
  it('generates curl statements for the full topology', () => {
    fullTopology()
    exportCurl(evt)
    const out = dom.ImExport.value

    expect(out).toContain('curl -u guest:guest')
    expect(out).toContain('http://localhost:15672/api/exchanges/%2f/Orders')
    expect(out).toContain('"type": "direct"')
    expect(out).toContain('{"alternate-exchange":"Orders-alt"}')
    expect(out).toContain('http://localhost:15672/api/queues/%2f/Order%20Queue')
    expect(out).toContain('"x-queue-type":"quorum"')
    expect(out).toContain('"x-dead-letter-exchange":"Orders"')
    expect(out).toContain('"x-dead-letter-routing-key":"dead"')
    expect(out).toContain('"x-message-ttl":"60000"')
    expect(out).toContain('"x-max-length":"10"')
    expect(out).toContain(
      'http://localhost:15672/api/bindings/%2f/e/Orders/q/Order%20Queue'
    )
    expect(out).toContain('"routing_key": "order.created"')
  })

  it('quotes an empty routing key in the binding body', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    const binding = factory.binding({
      source: exchange,
      destination: queue,
      routingKey: ''
    })
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportCurl(evt)
    expect(dom.ImExport.value).toContain('{"routing_key": "", "arguments": {}}')
  })

  it('skips bindings that reference a missing queue', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    const binding = factory.binding({ source: exchange, destination: queue })
    setScene({ exchanges: [exchange], bindings: [binding] })
    exportCurl(evt)
    expect(dom.ImExport.value).not.toContain('/bindings/')
  })

  it('url-encodes exchange and queue names', () => {
    const exchange = factory.exchange({ name: 'Orders & More' })
    const queue = factory.queue({ name: 'Incoming/Queue' })
    const binding = factory.binding({ source: exchange, destination: queue })
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportCurl(evt)
    const out = dom.ImExport.value
    expect(out).toContain(
      `exchanges/%2f/${encodeURIComponent('Orders & More')}`
    )
    expect(out).toContain(`queues/%2f/${encodeURIComponent('Incoming/Queue')}`)
    expect(out).toContain(
      `bindings/%2f/e/${encodeURIComponent('Orders & More')}/q/${encodeURIComponent('Incoming/Queue')}`
    )
  })
})

describe('exportRabbitmqadmin', () => {
  it('converts the default vhost %2f to /', () => {
    fullTopology()
    exportRabbitmqadmin(evt)
    const out = dom.ImExport.value
    expect(out).toContain('-H localhost')
    expect(out).toContain('-V /')
    expect(out).not.toContain('-V %2f')
  })

  it('generates declare statements with all queue arguments', () => {
    fullTopology()
    exportRabbitmqadmin(evt)
    const out = dom.ImExport.value
    expect(out).toContain(
      'declare exchange name="Orders" type="direct" durable=true'
    )
    expect(out).toContain(
      `arguments='${JSON.stringify({ 'alternate-exchange': 'Orders-alt' })}'`
    )
    expect(out).toContain('declare queue name="Order Queue" durable=true')
    expect(out).toContain(
      `arguments='${JSON.stringify({
        'x-queue-type': 'quorum',
        'x-dead-letter-exchange': 'Orders',
        'x-dead-letter-routing-key': 'dead',
        'x-message-ttl': '60000',
        'x-max-length': '10'
      })}'`
    )
    expect(out).toContain(
      'declare binding source="Orders" destination_type="queue" destination="Order Queue" routing_key="order.created"'
    )
  })

  it('keeps a custom vhost unchanged', () => {
    setSettings({ ...brokerDefaultSettings, vhost: 'production' })
    fullTopology()
    exportRabbitmqadmin(evt)
    expect(dom.ImExport.value).toContain('-V production')
  })

  it('adds only the queue type argument for a plain queue', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    setScene({ exchanges: [exchange], queues: [queue] })
    exportRabbitmqadmin(evt)
    const out = dom.ImExport.value
    expect(out).toContain('declare queue name="Order Queue" durable=true')
    expect(out).toContain('arguments=\'{"x-queue-type":"quorum"}\'')
    expect(out).not.toContain('"x-dead-letter-exchange"')
    expect(out).not.toContain('"x-message-ttl"')
    expect(out).not.toContain('"x-max-length"')
  })

  it('skips bindings that reference a missing queue', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    const binding = factory.binding({ source: exchange, destination: queue })
    setScene({ exchanges: [exchange], bindings: [binding] })
    exportRabbitmqadmin(evt)
    expect(dom.ImExport.value).not.toContain('declare binding')
  })
})

describe('exportTerraform', () => {
  it('generates the provider and vhost boilerplate', () => {
    setScene()
    exportTerraform(evt)
    const out = dom.ImExport.value
    expect(out).toContain('terraform {')
    expect(out).toContain('source = "cyrilgdn/rabbitmq"')
    expect(out).toContain('endpoint = "http://localhost:15672"')
    expect(out).toContain('username = "guest"')
    expect(out).toContain('resource "rabbitmq_vhost" "vhost"')
  })

  it('generates exchange, queue and binding resources', () => {
    fullTopology()
    exportTerraform(evt)
    const out = dom.ImExport.value
    expect(out).toContain('resource "rabbitmq_exchange" "Orders"')
    expect(out).toContain('name  = "Orders"')
    expect(out).toContain('type        = "direct"')
    expect(out).toContain('resource "rabbitmq_queue" "Order-Queue"')
    expect(out).toContain('variable "Order-Queueargs"')
    expect(out).toContain('"x-queue-type": "quorum"')
    expect(out).toContain('"x-dead-letter-exchange": "Orders"')
    expect(out).toContain('"x-dead-letter-routing-key": "dead"')
    expect(out).toContain('"x-message-ttl": 60000')
    expect(out).toContain('"x-max-length": 10')
    expect(out).toContain('resource "rabbitmq_binding" "OrdersOrder-Queue"')
    expect(out).toContain(
      'source           = "${rabbitmq_exchange.Orders.name}"'
    )
    expect(out).toContain(
      'destination      = "${rabbitmq_queue.Order-Queue.name}"'
    )
    expect(out).toContain('routing_key      = "order.created"')
  })

  it('turns a plain queue into a resource without extra args', () => {
    const exchange = factory.exchange()
    const queue = factory.queue()
    setScene({ exchanges: [exchange], queues: [queue] })
    exportTerraform(evt)
    const out = dom.ImExport.value
    expect(out).toContain('"x-queue-type": "quorum"')
    expect(out).not.toContain('"x-message-ttl"')
    expect(out).not.toContain('"x-max-length"')
  })

  it('keeps a custom vhost unchanged', () => {
    setSettings({ ...brokerDefaultSettings, vhost: 'production' })
    setScene()
    exportTerraform(evt)
    expect(dom.ImExport.value).toContain('name = "production"')
  })
})

describe('exportAsyncApi', () => {
  it('generates a valid document for a single direct exchange', () => {
    const exchange = factory.exchange({ name: 'Exchange', type: 'direct' })
    const queue = factory.queue({ name: 'Queue', type: 'quorum' })
    const binding = factory.binding({
      source: exchange,
      destination: queue,
      routingKey: ''
    })
    exchange.bindings = [binding]
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out).toContain('title: RabbitMQ')
    expect(out).toContain('  Exchange:')
    expect(out).toContain("type: 'direct'")
    expect(out).toContain('  Queue:')
    expect(out).toContain('type: quorum')
    expect(out).toContain('sendExchange/:')
    expect(out).toContain('#/channels/Exchange')
    expect(out).toContain('receiveQueue:')
    expect(out).toContain('components:')
    expect(out).toContain('EventName')
    expect(out).not.toContain('Exchange_')
  })

  it('emits a single send operation for a fanout exchange with many bindings', () => {
    const exchange = factory.exchange({ name: 'Exchange', type: 'fanout' })
    const queue = factory.queue({ name: 'Queue' })
    const bindings = [1, 2, 3].map((n) =>
      factory.binding({
        id: `b${n}`,
        source: exchange,
        destination: queue,
        routingKey: ''
      })
    )
    exchange.bindings = bindings
    setScene({ exchanges: [exchange], queues: [queue], bindings })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out.split('sendExchange/:').length - 1).toBe(1)
    expect(out).toContain("type: 'fanout'")
  })

  it('emits a single send operation for a direct exchange with many bindings', () => {
    const exchange = factory.exchange({ name: 'Exchange', type: 'direct' })
    const queue = factory.queue({ name: 'Queue' })
    const bindings = [
      factory.binding({
        id: 'b1',
        source: exchange,
        destination: queue,
        routingKey: 'Queue'
      }),
      factory.binding({
        id: 'b2',
        source: exchange,
        destination: queue,
        routingKey: 'other'
      })
    ]
    exchange.bindings = bindings
    setScene({ exchanges: [exchange], queues: [queue], bindings })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out.split('sendExchange/').length - 1).toBe(1)
    expect(out).not.toContain('sendExchange/other:')
  })

  it('does not append a trailing underscore for a topic exchange with empty routing key', () => {
    const exchange = factory.exchange({ name: 'Exchange', type: 'topic' })
    const queue = factory.queue()
    const binding = factory.binding({
      source: exchange,
      destination: queue,
      routingKey: ''
    })
    exchange.bindings = [binding]
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out).not.toContain('Exchange_')
    expect(out).toContain('  Exchange')
    expect(out).toContain('#/channels/Exchange')
  })

  it('skips hash bindings and stays consistent for a single topic exchange', () => {
    const exchange = factory.exchange({ name: 'Exchange', type: 'topic' })
    const queue = factory.queue({ name: 'Queue' })
    const binding = factory.binding({
      source: exchange,
      destination: queue,
      routingKey: '#'
    })
    exchange.bindings = [binding]
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out).not.toContain('Exchange_')
    expect(out).not.toContain('#/channels/Exchange')
    expect(out).toContain('receiveQueue:')
  })

  it('generates per-binding channels and operations for a topic exchange', () => {
    const exchange = factory.exchange({ name: 'Exchange', type: 'topic' })
    const queueA = factory.queue({ name: 'Queue 1' })
    const queueB = factory.queue({ name: 'Queue 2' })
    const bindingA = factory.binding({
      source: exchange,
      destination: queueA,
      routingKey: 'x.y.z'
    })
    const bindingB = factory.binding({
      source: exchange,
      destination: queueB,
      routingKey: 'x.x.x'
    })
    exchange.bindings = [bindingA, bindingB]
    setScene({
      exchanges: [exchange],
      queues: [queueA, queueB],
      bindings: [bindingA, bindingB]
    })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out).toContain('  Exchange_x.y.z')
    expect(out).toContain("address: 'x.y.z'")
    expect(out).toContain('  Exchange_x.x.x')
    expect(out).toContain('sendExchange/x.y.z:')
    expect(out).toContain('#/channels/Exchange_x.y.z')
    expect(out).not.toContain('Exchange_ ')
    expect(out).not.toContain('Exchange_\\n')
  })

  it('replaces spaces in names with underscores', () => {
    const exchange = factory.exchange({ name: 'My Exchange', type: 'topic' })
    const queue = factory.queue({ name: 'My Queue' })
    const binding = factory.binding({
      source: exchange,
      destination: queue,
      routingKey: 'a.b'
    })
    exchange.bindings = [binding]
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportAsyncApi(evt)
    const out = dom.ImExport.value

    expect(out).toContain('  My_Exchange_a.b')
    expect(out).toContain('receiveMy_Queue:')
    expect(out).toContain('#/channels/My_Exchange_a.b')
  })

  it('keeps a non-default vhost', () => {
    setSettings({ ...brokerDefaultSettings, vhost: 'production' })
    const exchange = factory.exchange({ name: 'Exchange', type: 'direct' })
    const queue = factory.queue({ name: 'Queue' })
    const binding = factory.binding({
      source: exchange,
      destination: queue,
      routingKey: ''
    })
    exchange.bindings = [binding]
    setScene({ exchanges: [exchange], queues: [queue], bindings: [binding] })
    exportAsyncApi(evt)
    expect(dom.ImExport.value).toContain('asyncapi: 3.0.0')
  })
})
