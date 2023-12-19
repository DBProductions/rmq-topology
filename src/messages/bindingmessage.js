import BaseMessage from './basemessage'

class BindingMessage extends BaseMessage {
  /**
   * Message object between exchange and queue.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Binding} binding - Binding object
   * @param {string} fillColor - hex color code to fill the circle
   * @extends BaseMessage
   */
  constructor(x, y, binding, fillColor) {
    super(x, y, 5, fillColor)
    this.binding = binding
    this.targetX = this.binding.destination.x
    this.targetY = this.binding.destination.y
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
      this.binding.destination.messageArrived(this)
    }
  }
}

export default BindingMessage
