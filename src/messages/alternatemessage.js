import BaseMessage from './basemessage'

class AlternateMessage extends BaseMessage {
  /**
   * Message object between exchange and exchange.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Exchange} exchange - Binding object
   * @param {string} fillColor - hex color code to fill the circle
   * @property {number} targetX - x of the binding destination
   * @property {number} targetY - y of the binding destination
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
    this.moveToTarget(this.targetX, this.targetY, () => {
      this.exchange.messageArrived(this)
    })
  }
}

export default AlternateMessage
