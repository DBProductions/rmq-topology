import BaseMessage from './basemessage'

class ExchangeMessage extends BaseMessage {
  /**
   * Message object between producer and exchange.<br>
   * The exchange receives this messages and route with another message.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Exchange} exchange - Exchange object
   * @param {string} routingKey - routing key of the message
   * @param {boolean} rejected - rejected message
   * @param {number} radius - radius of the circle
   * @param {string} fillColor - hex color code to fill the circle
   * @property {number} targetX - x of the exchange
   * @property {number} targetY - y of the exchange
   * @extends BaseMessage
   */
  constructor(
    x,
    y,
    exchange,
    routingKey,
    message,
    rejected,
    radius,
    fillColor
  ) {
    super(x, y, radius, fillColor)
    this.exchange = exchange
    this.routingKey = routingKey
    this.message = message
    this.rejected = rejected || false
    this.targetX = this.exchange.x
    this.targetY = this.exchange.y
  }

  update() {
    this.moveToTarget(this.targetX, this.targetY, () => {
      this.exchange.messageArrived(this)
    })
  }
}

export default ExchangeMessage
