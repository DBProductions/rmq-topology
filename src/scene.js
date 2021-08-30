class Scene {
  /**
   * The scene with actors to call their update and render methods to simulate.
   * @param {*} ctx - context of the canvas
   * @param {number} width - width of the canvas
   * @param {number} height - height of the canvas
   */
  constructor(ctx, width, height) {
    this.ctx = ctx
    this.width = width
    this.height = height
    this.curleft = 0
    this.curtop = 0
    const off = this.DOMOffset(ctx.canvas)
    ;[this.x, this.y] = [off[0], off[1]]
    this.actors = []
    this.lostMessages = 0
    this.description = ''
  }

  /**
   * Get DOM offset from givven element.
   * @param {Object} el - HTML DOM element
   */
  DOMOffset(el) {
    let ele = el
    if (ele.offsetParent) {
      do {
        this.curleft += ele.offsetLeft
        this.curtop += ele.offsetTop
      } while ((ele = ele.offsetParent)) // eslint-disable-line no-cond-assign
    }
    return { x: this.curleft, y: this.curtop }
  }

  /**
   * Add an actor to the scene.
   * @param {Object} actor
   */
  addActor(actor) {
    this.actors.push(actor)
  }

  /**
   * Remove an actor from the scene.
   * @param {Object} actor
   */
  removeActor(actor) {
    this.actors.splice(
      this.actors.findIndex((o) => o === actor),
      1
    )
  }

  /**
   * Get object to id from scene.
   * @param {string} id
   */
  getIdInScene(id) {
    let actor = null
    this.actors.forEach((val) => {
      if (val.id === id) {
        actor = val
      }
    })
    return actor
  }

  /**
   * Get objects based on the obj constructor.
   * @param {string} obj
   */
  getObjectsInScene(obj) {
    const objs = []
    this.actors.forEach((val) => {
      if (val.constructor.name === obj) {
        objs.push(val)
      }
    })
    return objs
  }

  /**
   * Empty the scene with setting and empty list as actors.
   */
  purge() {
    this.actors = []
  }

  update(dt) {
    for (let i = 0; i < this.actors.length; i += 1) {
      this.actors[i].update(dt)
    }
  }

  render(dt) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    if (this.actors.length > 0) {
      this.ctx.font = '10px Arial'
      this.ctx.fillStyle = '#000'
      this.ctx.fillText(`${this.lostMessages} messages lost`, 50, 20)
    }
    this.ctx.font = '12px Arial'
    this.ctx.fillText(this.description, 50, this.height - 20)

    const allBindings = this.actors.filter(
      (s) => s.constructor.name === 'Binding'
    )
    allBindings.forEach((val) => {
      val.render(dt)
    })

    const notBinding = this.actors.filter(
      (s) => s.constructor.name !== 'Binding'
    )
    notBinding.forEach((val) => {
      val.render(dt)
    })
  }

  renderOnce(dt) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    if (this.actors.length > 0) {
      this.ctx.font = '10px Arial'
      this.ctx.fillStyle = '#000'
      this.ctx.fillText(`${this.lostMessages} messages lost`, 50, 20)
    }
    this.ctx.font = '12px Arial'
    this.ctx.fillText(this.description, 50, this.height - 20)

    const allBindings = this.actors.filter(
      (s) => s.constructor.name === 'Binding'
    )
    allBindings.forEach((val) => {
      val.render(dt)
    })

    const notBinding = this.actors.filter(
      (s) => s.constructor.name !== 'Binding'
    )
    notBinding.forEach((val) => {
      val.render(dt)
    })
  }
}

export default Scene
