import {
  linepointNearestMouse,
  findCircle,
  findSquare,
  findLine,
  findPosition
} from '../utils/common'
import Exchange from '../exchange'
import Queue from '../queue'
import Producer from '../producer'
import Consumer from '../consumer'
import Binding from '../binding'

describe('linepointNearestMouse', () => {
  it('should return the nearest point on a horizontal line', () => {
    const line = { x0: 0, y0: 0, x1: 100, y1: 0 }
    const result = linepointNearestMouse(line, 50, 10)
    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(0)
  })

  it('should return the nearest point on a vertical line', () => {
    const line = { x0: 0, y0: 0, x1: 0, y1: 100 }
    const result = linepointNearestMouse(line, 10, 50)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(50)
  })

  it('should return the nearest point on a diagonal line', () => {
    const line = { x0: 0, y0: 0, x1: 100, y1: 100 }
    const result = linepointNearestMouse(line, 50, 50)
    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(50)
  })

  it('should extrapolate beyond line start (lerp behavior)', () => {
    const line = { x0: 10, y0: 10, x1: 50, y1: 50 }
    const result = linepointNearestMouse(line, -10, -10)
    expect(typeof result.x).toBe('number')
    expect(typeof result.y).toBe('number')
  })

  it('should extrapolate beyond line end (lerp behavior)', () => {
    const line = { x0: 10, y0: 10, x1: 50, y1: 50 }
    const result = linepointNearestMouse(line, 100, 100)
    expect(typeof result.x).toBe('number')
    expect(typeof result.y).toBe('number')
  })
})

describe('findCircle', () => {
  let exchange
  let queue

  beforeEach(() => {
    exchange = new Exchange(100, 100, 'ex', 'direct')
    queue = new Queue(200, 200, 'q')
  })

  it('should return the exchange when mouse is inside radius', () => {
    const result = findCircle(exchange, 100, 100)
    expect(result).toBe(exchange)
  })

  it('should return undefined when mouse is outside radius', () => {
    const result = findCircle(exchange, 1000, 1000)
    expect(result).toBeUndefined()
  })

  it('should return the queue when mouse is inside radius', () => {
    const result = findCircle(queue, 200, 200)
    expect(result).toBe(queue)
  })

  it('should return undefined for non-Exchange/non-Queue objects', () => {
    const producer = new Producer(100, 100, 'p')
    const result = findCircle(producer, 100, 100)
    expect(result).toBeUndefined()
  })

  it('should return the exchange at exact edge of radius (<=)', () => {
    const result = findCircle(exchange, 100 + exchange.radius, 100)
    expect(result).toBe(exchange)
  })
})

describe('findSquare', () => {
  let producer
  let consumer

  beforeEach(() => {
    producer = new Producer(50, 50, 'p')
    consumer = new Consumer(100, 100, 'c')
  })

  it('should return the producer when mouse is inside bounds', () => {
    const result = findSquare(producer, 55, 55)
    expect(result).toBe(producer)
  })

  it('should return undefined when mouse is outside bounds', () => {
    const result = findSquare(producer, 0, 0)
    expect(result).toBeUndefined()
  })

  it('should return the consumer when mouse is inside bounds', () => {
    const result = findSquare(consumer, 110, 110)
    expect(result).toBe(consumer)
  })

  it('should return undefined for non-Producer/non-Consumer objects', () => {
    const exchange = new Exchange(50, 50, 'ex', 'direct')
    const result = findSquare(exchange, 55, 55)
    expect(result).toBeUndefined()
  })

  it('should return producer at exact bottom-right edge (<=)', () => {
    const result = findSquare(
      producer,
      50 + producer.width,
      50 + producer.height
    )
    expect(result).toBe(producer)
  })

  it('should return producer at top-left corner', () => {
    const result = findSquare(producer, 50, 50)
    expect(result).toBe(producer)
  })
})

describe('findLine', () => {
  let source
  let destination
  let binding

  beforeEach(() => {
    source = { x: 0, y: 0, bindings: [] }
    destination = { x: 100, y: 0, bindings: [] }
    binding = new Binding(source, destination, 'rk')
  })

  it('should return the binding when mouse is near the line', () => {
    const result = findLine(binding, 50, 1)
    expect(result).toBe(binding)
  })

  it('should return undefined when mouse is far from the line', () => {
    const result = findLine(binding, 50, 50)
    expect(result).toBeUndefined()
  })

  it('should return undefined when mouse is outside x range', () => {
    const result = findLine(binding, 200, 0)
    expect(result).toBeUndefined()
  })

  it('should handle reversed x coordinates', () => {
    const src = { x: 100, y: 0, bindings: [] }
    const dest = { x: 0, y: 0, bindings: [] }
    const b = new Binding(src, dest, 'rk')
    const result = findLine(b, 50, 1)
    expect(result).toBe(b)
  })
})

describe('findPosition', () => {
  let scene
  let exchange
  let producer
  let consumer
  let source
  let destination
  let binding

  beforeEach(() => {
    exchange = new Exchange(200, 200, 'ex', 'direct')
    producer = new Producer(100, 100, 'p')
    consumer = new Consumer(300, 300, 'c')
    source = { x: 0, y: 0, bindings: [] }
    destination = { x: 400, y: 400, bindings: [] }
    binding = new Binding(source, destination, 'rk')

    scene = { actors: [exchange, producer, consumer, binding] }
    globalThis.scene = scene
  })

  afterEach(() => {
    globalThis.scene = undefined
  })

  it('should find a producer by mouse position', () => {
    const e = {
      clientX: 105,
      clientY: 105,
      target: { offsetLeft: 0, offsetTop: 0 }
    }
    const result = findPosition(e)
    expect(result).toBe(producer)
  })

  it('should find an exchange by mouse position', () => {
    const e = {
      clientX: 200,
      clientY: 200,
      target: { offsetLeft: 0, offsetTop: 0 }
    }
    const result = findPosition(e)
    expect(result).toBe(exchange)
  })

  it('should find a consumer by mouse position', () => {
    const e = {
      clientX: 305,
      clientY: 305,
      target: { offsetLeft: 0, offsetTop: 0 }
    }
    const result = findPosition(e)
    expect(result).toBe(consumer)
  })

  it('should find a binding when line=true', () => {
    const e = {
      clientX: 50,
      clientY: 50,
      target: { offsetLeft: 0, offsetTop: 0 }
    }
    const result = findPosition(e, true)
    expect(result).toBeDefined()
  })

  it('should return undefined when no actor matches', () => {
    const e = {
      clientX: 999,
      clientY: 999,
      target: { offsetLeft: 0, offsetTop: 0 }
    }
    const result = findPosition(e)
    expect(result).toBeUndefined()
  })

  it('should not search lines when line=false', () => {
    const e = {
      clientX: 50,
      clientY: 1,
      target: { offsetLeft: 0, offsetTop: 0 }
    }
    const result = findPosition(e, false)
    expect(result).toBeUndefined()
  })
})
