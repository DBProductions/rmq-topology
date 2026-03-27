import Base from './base'

class BaseComponent extends Base {
  /**
   * Base component class for other components.
   * It generates the UUID to identify the component and set default values.
   *
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
}

export default BaseComponent
