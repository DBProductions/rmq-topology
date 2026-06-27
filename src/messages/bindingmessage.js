import BaseMessage from './basemessage'

class BindingMessage extends BaseMessage {
  /**
   * Message object between exchange and queue.
   *
   * @param {number} x - x position of the message
   * @param {number} y - y position of the message
   * @param {Binding} binding - Binding object
   * @param {string} fillColor - hex color code to fill the circle
   * @property {number} targetX - x of the binding destination
   * @property {number} targetY - y of the binding destination
   * @extends BaseMessage
   */
  constructor(x, y, binding, fillColor) {
    super(x, y, 5, fillColor)
    this.binding = binding
    this.targetX = this.binding.destination.x
    this.targetY = this.binding.destination.y
  }

  update() {
    this.moveToTarget(this.targetX, this.targetY, () => {
      this.binding.destination.messageArrived(this)
    })
  }
}

export default BindingMessage
