import BaseMessage from './basemessage'

class RejectMessage extends BaseMessage {
  /**
   * Message object when a message gets rejected from consumer.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Queue} queue - Queue object
   * @param {Object} message - message object with headers and body
   * @property {number} targetX - x of the consumer
   * @property {number} targetY - y of the consumer
   * @extends BaseMessage
   */
  constructor(x, y, queue, message) {
    super(x, y)
    this.queue = queue
    if (message) {
      this.message = message
    } else if (!this.message) {
      this.message = {
        headers: {},
        body: {}
      }
    }
    this.rejected = true
    if (this.queue) {
      this.targetX = this.queue.x
      this.targetY = this.queue.y
    }
  }

  update() {
    if (this.queue) {
      this.moveToTarget(this.targetX, this.targetY, () => {
        this.queue.messageArrived(this)
      })
    }
  }
}

export default RejectMessage
