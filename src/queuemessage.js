import BaseMessage from './basemessage'

class QueueMessage extends BaseMessage {
  /**
   * Message object between queue and consumer.
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Queue} queue - Queue object
   * @param {Consumer} consumer - Consumer object
   * @param {string} fillStyle
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
   * @param {Consumer} consumer - Consumer object
   */
  setConsumer(consumer) {
    this.consumer = consumer
    this.targetX = this.consumer.x + this.consumer.width / 2
    this.targetY = this.consumer.y + this.consumer.height / 2
  }

  update() {
    if (this.consumer) {
      this.dx = this.targetX - this.x
      this.dy = this.targetY - this.y
      this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
      this.rad = Math.atan2(this.dy, this.dx)
      this.angle = (this.rad / Math.PI) * 180

      const velX = (this.dx / this.dist) * this.thrust
      const velY = (this.dy / this.dist) * this.thrust
      if (this.dist > 3) {
        this.x += velX
        this.y += velY
      } else {
        this.consumer.messageArrived(this)
      }
    }
  }
}

export default QueueMessage
