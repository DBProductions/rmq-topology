import BaseMessage from './basemessage'

class AlternateMessage extends BaseMessage {
  /**
   * Message object between exchange and queue.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Exchange} exchange - Binding object
   * @param {string} fillColor - hex color code to fill the circle
   * @extends BaseMessage
   */
  constructor(x, y, exchange, routingKey, fillColor) {
    super(x, y, 5, fillColor)
    this.exchange = exchange
    this.routingKey = routingKey
    this.targetX = this.exchange.x
    this.targetY = this.exchange.y
  }

  update() {
    this.dx = this.targetX - this.x
    this.dy = this.targetY - this.y
    this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    this.rad = Math.atan2(this.dy, this.dx)
    this.angle = (this.rad / Math.PI) * 180

    if (this.dist > 3) {
      this.x += (this.dx / this.dist) * this.thrust
      this.y += (this.dy / this.dist) * this.thrust
    } else {
      this.exchange.messageArrived(this)
    }
  }
}

export default AlternateMessage
