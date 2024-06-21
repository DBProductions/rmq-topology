import Queue from '../queue'
import Consumer from '../consumer'
import BaseComponent from '../basecomponent'

describe('Queue', () => {
  let queue
  let consumer1
  let consumer2
  let scene

  beforeEach(() => {
    // Initialize test variables for each test case
    queue = new Queue(0, 0)
    scene = { addActor: vi.fn() }
    consumer1 = new Consumer(0, 0)
    consumer2 = { id: 'consumer2' }
  })

  it('should correctly add a consumer to the queue', () => {
    queue.addConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer1])
  })

  it('should not allow duplicate consumers', () => {
    queue.addConsumer(consumer1)
    queue.addConsumer(consumer1)
    expect(queue.consumers).toEqual([consumer1])
  })

  it('should correctly add multiple consumers to the queue', () => {
    queue.addConsumer(consumer1)
    queue.addConsumer(consumer2)
    expect(queue.consumers).toEqual([consumer1, consumer2])
  })
})
