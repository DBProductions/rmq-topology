import Base from '../base'

class BaseMessage extends Base {
  /**
   * Base message class for other messages.
   *
   * @param {number} x - x position
   * @param {number} y - y position
   * @param {integer} radius - radius of the circle
   * @param {string} fillStyle - hex color code to fill the circle
   * @property {string} id - unique identifier
   * @property {number} x - x position
   * @property {number} y - y position
   * @property {Object} message -  message object
   * @property {Object} message.headers - message headers
   * @property {Object} message.body - message body
   * @extends Base
   */
  constructor(x, y, radius, fillStyle) {
    super(x, y)
    this.id = this.createUUID()
    this.x = x
    this.y = y
    this.radius = radius || 3
    this.fillStyle = fillStyle || '#c82124'
    this.thrust = 5
    this.message = {
      headers: {},
      body: {}
    }
  }

  /**
   * Moves the message toward a target position. Calls onArrival when reached.
   *
   * @param {number} targetX
   * @param {number} targetY
   * @param {Function} onArrival
   */
  moveToTarget(targetX, targetY, onArrival) {
    const dx = targetX - this.x
    const dy = targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > 3) {
      this.x += (dx / dist) * this.thrust
      this.y += (dy / dist) * this.thrust
    } else {
      onArrival()
    }
  }

  /**
   * Renders a circle representing the message.
   */
  render() {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.fillStyle
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }
}

export default BaseMessage
