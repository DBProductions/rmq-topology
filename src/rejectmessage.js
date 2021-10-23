import BaseMessage from './basemessage'

class RejectMessage extends BaseMessage {
  /**
   * Message object when a message gets rejected from consumer.
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Queue} queue - Queue object
   * @extends BaseMessage
   */
  constructor(x, y, queue) {
    super(x, y)
    this.queue = queue
    this.rejected = true
    if (this.queue) {
      this.targetX = this.queue.x
      this.targetY = this.queue.y
    }
  }

  update() {
    if (this.queue) {
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
        this.queue.messageArrived(this)
      }
    }
  }
}

export default RejectMessage
