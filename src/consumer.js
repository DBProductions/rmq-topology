import BaseComponent from './basecomponent'
import RejectMessage from './rejectmessage'

class Consumer extends BaseComponent {
  /**
   *
   * @param {number} x - x position of the consumer
   * @param {number} y - y position of the consumer
   * @param {string} name - optional identifier
   * @param {*} consumes
   * @param {string} mode - ack or reject
   * @extends BaseComponent
   */
  constructor(x, y, name, consumes, mode) {
    super(x, y)
    this.name = name
    this.mode = mode || 'ack'
    this.arrivedMessages = 0
    this.width = 30
    this.height = 30
    this.consumes = consumes
    this.queues = []
  }

  /**
   * Adds a queue to the list.
   * @param {Queue} queue - Queue object
   */
  addQueue(queue) {
    const queueIndex = this.queues.findIndex((e) => e === queue)
    if (queueIndex === -1) {
      queue.addConsumer(this)
      this.queues.push(queue)
    }
  }

  /**
   * Removes a queue from the list or empty the list.
   * @param {Queue} queue - Queue object
   */
  removeQueue(queue) {
    const queueIndex = this.queues.findIndex((e) => e === queue)
    if (queueIndex !== -1) {
      if (this.queues.length === 1) {
        this.queues = []
      } else {
        this.queues.splice(queueIndex, 1)
      }
    }
  }

  /**
   * Handler for arriving messages.
   * @param {QueueMessage} msg - message object
   */
  messageArrived(msg) {
    if (this.mode === 'reject') {
      new RejectMessage(
        this.x + this.width / 2,
        this.y + this.height / 2,
        msg.queue
      ).addToScene(this.scene)
    } else {
      this.arrivedMessages += 1
    }
    this.scene.removeActor(msg)
  }

  render() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'
    this.ctx.setLineDash([])
    this.ctx.lineWidth = 1
    if (this.hover) {
      this.ctx.lineWidth = 2
    }
    this.ctx.rect(this.x, this.y, this.width, this.height)
    this.ctx.stroke()

    if (this.dragged) {
      this.ctx.fillStyle = '#ccc'
      this.ctx.fill()
    }

    this.ctx.font = '10px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText(
      `${this.name} (${this.mode})`,
      this.x - `${this.name} (${this.mode})`.length,
      this.y + this.height + 10
    )
    this.ctx.fillText(
      `${this.arrivedMessages} msgs arrived`,
      this.x - `${this.arrivedMessages} msgs arrived`.length,
      this.y + this.height + 20
    )

    this.queues.forEach((val) => {
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#aaa'
      this.ctx.setLineDash([4, 4])
      this.ctx.lineWidth = 1
      this.ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2)
      this.ctx.lineTo(val.x, val.y)
      this.ctx.stroke()
    })
  }
}

export default Consumer
