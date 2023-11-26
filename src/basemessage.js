import Base from './base'

class BaseMessage extends Base {
  /**
   * Base message class for other messages.
   *
   * @param {number} x - x position
   * @param {number} y - y position
   * @param {integer} radius - radius of the circle
   * @param {string} fillStyle - hex color code to fill the circle
   * @extends Base
   */
  constructor(x, y, radius, fillStyle) {
    super(x, y)
    this.id = this.createUUID()
    this.x = x
    this.y = y
    this.radius = radius || 3
    this.fillStyle = fillStyle || '#c82124'
    this.dist = null
    this.rad = null
    this.angle = null
    this.thrust = 5
    this.message = {
      headers: {},
      body: {}
    }
  }

  /**
   * Renders the circle representing the message.
   */
  render() {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.fillStyle
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }
}

export default BaseMessage
