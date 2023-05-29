import BaseComponent from './basecomponent'
import BindingMessage from './bindingmessage'

class Exchange extends BaseComponent {
  /**
   * Exchange class represents a component which receives messages and route them to queues.
   * @param {number} x - x position of the exchange
   * @param {number} y - y position of the exchange
   * @param {string} name - identifier
   * @param {string} type - exchange type
   * @extends BaseComponent
   */
  constructor(x, y, name, type) {
    super(x, y)
    this.name = name
    this.type = type || 'direct'
    this.radius = 15
    // this.binding = null;
    this.bindings = []
  }

  /**
   * Removes a binding from the exchange.
   * @param {Binding} binding - Binding object
   */
  removeBinding(binding) {
    const bindingIndex = this.bindings.findIndex((c) => c === binding)
    if (bindingIndex !== -1) {
      if (this.bindings.length === 1) {
        this.bindings = []
      } else {
        this.bindings.splice(bindingIndex, 1)
      }
    }
  }

  /**
   * Handler for arriving messages.
   * @param {ExchangeMessage} msg
   */
  messageArrived(msg) {
    const { routingKey, fillStyle } = msg
    let sendMsg = false
    this.bindings.forEach((val) => {
      if (this.type === 'topic') {
        // more specific to handle * or #
        if (val.routingKey === routingKey || val.routingKey === '#') {
          new BindingMessage(this.x, this.y, val, fillStyle).addToScene(
            this.scene
          )
          sendMsg = true
        }
      } else if (this.type === 'direct') {
        if (val.destination.name === routingKey) {
          new BindingMessage(this.x, this.y, val, fillStyle).addToScene(
            this.scene
          )
          sendMsg = true
        }
        if (!routingKey) {
          new BindingMessage(this.x, this.y, val, fillStyle).addToScene(
            this.scene
          )
          sendMsg = true
        }
      } else {
        new BindingMessage(this.x, this.y, val, fillStyle).addToScene(
          this.scene
        )
        sendMsg = true
      }
    })
    // not routed, message is lost
    if (this.bindings.length === 0) {
      this.scene.lostMessages += 1
    }
    // message not send, then it's lost
    if (!sendMsg) {
      this.scene.lostMessages += 1
    }
    this.scene.removeActor(msg)
  }

  render() {
    /*
        const gradient = this.ctx.createRadialGradient(
            this.x,
            this.y,
            1,
            this.x,
            this.y,
            this.radius,
        );
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'gray');
        */

    // shadow
    this.ctx.globalAlpha = 0.4
    this.ctx.beginPath()
    this.ctx.fillStyle = '#000'
    this.ctx.arc(this.x + 2, this.y + 2, this.radius, 0, 2 * Math.PI)
    this.ctx.fill()

    this.ctx.globalAlpha = 1.0
    this.ctx.beginPath()
    // this.ctx.fillStyle = gradient;
    this.ctx.fillStyle = '#ccc'
    this.ctx.setLineDash([])
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    this.ctx.fill()

    if (this.dragged) {
      this.ctx.stroke()
    }

    if (this.hover) {
      this.ctx.stroke()
    }

    this.ctx.font = '10px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText(
      this.name,
      this.x - this.radius,
      this.y + this.radius + 10
    )
    this.ctx.fillText(
      this.type,
      this.x - this.radius,
      this.y + this.radius + 22
    )
  }
}

export default Exchange
