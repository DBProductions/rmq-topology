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
   * @param {Object} message - message object with headers and body
   * @param {string} routingKey - routing key used to deliver the message
   * @param {Exchange} exchange - exchange that routed the message
   * @property {number} targetX - x of the consumer
   * @property {number} targetY - y of the consumer
   * @extends BaseMessage
   */
  constructor(
    x,
    y,
    queue,
    consumer,
    fillStyle,
    message,
    routingKey,
    exchange
  ) {
    super(x, y, 3, fillStyle)
    this.queue = queue
    this.consumer = consumer
    this.routingKey = routingKey || ''
    this.exchange = exchange || null
    if (message) {
      this.message = message
    } else if (!this.message) {
      this.message = {
        headers: {},
        body: {}
      }
    }
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
