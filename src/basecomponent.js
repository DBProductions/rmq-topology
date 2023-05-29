import Base from './base'

class BaseComponent extends Base {
  /**
   * Base component class for other components.
   * @param {number} x - x position
   * @param {number} y - y position
   * @extends Base
   */
  constructor(x, y) {
    super(x, y)
    this.id = this.createUUID()
    this.x = x
    this.y = y
    this.dragged = false
    this.hover = false
    this.debug = false
  }

  update(dt) {} // eslint-disable-line no-unused-vars
}

export default BaseComponent
