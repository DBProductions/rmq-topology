class Base {
  /**
   * Base class for other components.
   * @param {number} x - x position
   * @param {number} y - y position
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * Add object to scene.
   * @param {Scene} scene - scene on canvas
   * @returns {object} this
   */
  addToScene(scene) {
    this.scene = scene
    this.ctx = scene.ctx
    scene.addActor(this)
    return this
  }

  /**
   * Generates an UUID.
   *
   * https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-253.php
   * @returns {string} - uuid
   */
  createUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    )
  }

  update(dt) {} // eslint-disable-line class-methods-use-this
}

export default Base
