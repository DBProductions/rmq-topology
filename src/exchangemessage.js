import BaseMessage from './basemessage'

class ExchangeMessage extends BaseMessage {
  /**
   * Message object between producer and exchange.
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Exchange} exchange - Exchange object
   * @param {string} routingKey - routing key of the message
   * @param {boolean} rejected - rejected message
   * @param {number} radius - radius of the circle
   * @param {string} fillColor - hex color code to fill the circle
   * @extends BaseMessage
   */
  constructor(x, y, exchange, routingKey, rejected, radius, fillColor) {
    super(x, y, radius, fillColor)
    this.exchange = exchange
    this.rejected = rejected || false
    this.targetX = this.exchange.x
    this.targetY = this.exchange.y
    this.routingKey = routingKey
  }

  update() {
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
      this.exchange.messageArrived(this)
    }
  }
}

export default ExchangeMessage
