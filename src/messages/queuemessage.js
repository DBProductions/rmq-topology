import BaseMessage from './basemessage'

class QueueMessage extends BaseMessage {
  /**
   * Message object between queue and consumer.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Queue} queue - Queue object
   * @param {Consumer} consumer - Consumer object
   * @param {string} fillStyle
   * @property {number} targetX - x of the consumer
   * @property {number} targetY - y of the consumer
   * @extends BaseMessage
   */
  constructor(x, y, queue, consumer, fillStyle) {
    super(x, y, 3, fillStyle)
    this.queue = queue
    this.consumer = consumer
    if (this.consumer) {
      this.targetX = this.consumer.x + this.consumer.width / 2
      this.targetY = this.consumer.y + this.consumer.height / 2
    }
  }

  /**
   * Sets the consumer with coordinates.
   *
   * @param {Consumer} consumer - Consumer object
   */
  setConsumer(consumer) {
    this.consumer = consumer
    this.targetX = this.consumer.x + this.consumer.width / 2
    this.targetY = this.consumer.y + this.consumer.height / 2
  }

  update() {
    if (this.consumer) {
      this.moveToTarget(this.targetX, this.targetY, () => {
        this.consumer.messageArrived(this)
      })
    }
  }
}

export default QueueMessage
