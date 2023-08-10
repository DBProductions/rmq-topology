import BaseComponent from './basecomponent'

class Binding extends BaseComponent {
  /**
   * Binging class represents the binding between an exchange and a queue.
   *
   * @param {object} source
   * @param {object} destination
   * @param {string} routingKey - used routing key
   * @extends BaseComponent
   */
  constructor(source, destination, routingKey) {
    super(0, 0)
    this.source = source
    this.destination = destination
    this.routingKey = routingKey
    // eslint-disable-next-line no-param-reassign
    source.binding = this
    // eslint-disable-next-line no-param-reassign
    destination.binding = this
    source.bindings.push(this)
    destination.bindings.push(this)
    this.setCoords()
  }

  /**
   * Sets x and y for the source and destination property.
   */
  setCoords() {
    this.x1 = this.source.x
    this.x2 = this.destination.x
    this.y1 = this.source.y
    this.y2 = this.destination.y
  }

  /**
   * http://phrogz.net/tmp/canvas_rotated_text.html
   *
   * @param {string} text - text to draw as label
   */
  drawLabel(text) {
    const alignment = 'center'
    const dx = this.x2 - this.x1
    const dy = this.y2 - this.y1
    const p = { x: this.x1, y: this.y1 }
    const pad = 1 / 2

    this.ctx.save()
    this.ctx.textAlign = alignment
    this.ctx.translate(p.x + dx * pad, p.y + dy * pad)
    this.ctx.rotate(Math.atan2(dy, dx + 3))
    this.ctx.fillText(text, 0, 0)
    this.ctx.restore()
  }

  update() {
    this.setCoords()
    this.dx = this.x2 - this.x1
    this.dy = this.y2 - this.y1
  }

  render() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'
    this.ctx.setLineDash([])
    this.ctx.lineWidth = 1
    if (this.hover) {
      this.ctx.lineWidth = 2
    }
    this.ctx.moveTo(this.x1, this.y1)
    this.ctx.lineTo(this.x2, this.y2)
    this.ctx.stroke()

    this.drawLabel(this.routingKey)
  }
}

export default Binding
