import Consumer from '../consumer'
import Queue from '../queue'
import QueueMessage from '../messages/queuemessage'

describe('Consumer', () => {
  let consumer, queue, qm

  beforeEach(() => {
    consumer = new Consumer(0, 0) // Create a new instance of the Consumer class
    queue = new Queue(1, 1) // Create a new instance of the Queue class
    qm = new QueueMessage(0, 0, queue, consumer)
  })

  it('should create a new Consumer with default values', () => {
    expect(consumer.x).toBe(0)
    expect(consumer.y).toBe(0)
    expect(consumer.name).toBeUndefined()
    expect(consumer.mode).toBe('ack')
    expect(consumer.arrivedMessages).toBe(0)
    expect(consumer.width).toBe(30)
    expect(consumer.height).toBe(30)
  })

  it('should add a queue to the list', () => {
    consumer.addQueue(queue)
    expect(consumer.queues.length).toBe(1)
    expect(consumer.queues[0]).toEqual(queue)
  })

  it('should remove a queue from the list', () => {
    consumer.addQueue(queue)
    consumer.removeQueue(queue)
    expect(consumer.queues.length).toBe(0)
  })
})
