import BaseComponent from './basecomponent'
import ExchangeMessage from './messages/exchangemessage'

/**
 * Creates an independent copy of a message so in-flight messages are not
 * affected by later publishes.
 *
 * @param {Object} message - message with headers and body
 * @returns {Object} cloned message
 */
const cloneMessage = (message) => {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(message)
    } catch (e) {}
  }
  try {
    return JSON.parse(JSON.stringify(message))
  } catch (e) {
    return { headers: {}, body: {} }
  }
}

class Producer extends BaseComponent {
  /**
   * Producer class represents a component that publishs against exchanges.
   *
   * @param {number} x - x position of the producer
   * @param {number} y - y position of the producer
   * @param {string} name - optional identifier
   * @param {(object|Array)} publishes - list of exchanges to publish to
   * @property {number} width - Width of the square
   * @property {number} height - Height of the square
   * @extends BaseComponent
   */
  constructor(x, y, name, publishes) {
    super(x, y)
    this.name = name
    this.publishes = publishes || {}
    this.width = 20
    this.height = 20
    this.spawnTime = 1.0 // seconds
    this.fullSpawnTime = this.spawnTime
    let color = '#'
    for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10)
    }
    this.color = color
    this.publishedMessages = 0
  }

  /**
   * Removes the exchange from the list.
   *
   * @param {Exchange} exchange - Exchange object
   */
  removeExchange(exchange) {
    for (const key in this.publishes) {
      if (this.publishes[key].exchange === exchange) {
        delete this.publishes[key]
      }
    }
  }

  /**
   * Adds a message to an exchange.
   *
   * @param {Exchange} exchange - Exchange object
   * @param {string} routingKey - routing key
   * @param {Object} message - JSON message with headers and body
   */
  addMessageToExchange(exchange, routingKey, message) {
    let msg = message
    if (!msg) {
      msg = {
        headers: {},
        body: {}
      }
    }
    if (typeof structuredClone === 'function') {
      msg = structuredClone(msg)
    } else {
      try {
        msg = JSON.parse(JSON.stringify(msg))
      } catch (e) {
        msg = {
          headers: {},
          body: {}
        }
      }
    }
    if (
      !msg.headers ||
      typeof msg.headers !== 'object' ||
      Array.isArray(msg.headers)
    ) {
      msg.headers = {}
    }
    if (msg.body === undefined || msg.body === null) {
      msg.body = {}
    }
    if (!this.exchangeWithRoutingKeyExists(exchange, routingKey)) {
      let index = 0
      while (Object.prototype.hasOwnProperty.call(this.publishes, index)) {
        index += 1
      }
      this.publishes[index] = {
        exchange,
        routingKey,
        message: msg
      }
    }
  }

  /**
   * Checks for exchange in combination with routing key to exists.
   *
   * @param {Exchange} exchange - Exchange object
   * @param {string} routingKey - routing key
   */
  exchangeWithRoutingKeyExists(exchange, routingKey) {
    for (const key in this.publishes) {
      if (
        this.publishes[key].exchange === exchange &&
        this.publishes[key].routingKey === routingKey
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Determines at which time a new message be published.
   *
   * @param {number} dt - delta time from the timer
   */
  update(dt) {
    this.spawnTime -= dt
    if (this.spawnTime < 0) {
      for (const key in this.publishes) {
        if (!this.publishes[key].message) {
          this.publishes[key].message = {
            headers: {},
            body: {}
          }
        }
        if (
          !this.publishes[key].message.headers ||
          typeof this.publishes[key].message.headers !== 'object' ||
          Array.isArray(this.publishes[key].message.headers)
        ) {
          this.publishes[key].message.headers = {}
        }
        const message = cloneMessage(this.publishes[key].message)
        message.headers['app-id'] = this.name
        message.headers['message-id'] = this.createUUID()

        new ExchangeMessage(
          this.x + this.width / 2,
          this.y + this.height / 2,
          this.publishes[key].exchange,
          this.publishes[key].routingKey,
          message,
          undefined,
          undefined,
          this.color
        ).addToScene(this.scene)
        this.publishedMessages += 1
      }
      this.spawnTime = this.fullSpawnTime
    }
  }

  /**
   * Render the producer and draw lines to every exchange from the list.
   */
  render() {
    this.ctx.setLineDash([])
    // shadow
    this.ctx.globalAlpha = 0.4
    this.ctx.beginPath()
    this.ctx.fillStyle = '#000'
    this.ctx.rect(this.x + 2, this.y + 2, this.width, this.height)
    this.ctx.fill()

    this.ctx.globalAlpha = 1.0
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 1
    if (this.hover) {
      this.ctx.lineWidth = 2
    }
    this.ctx.rect(this.x, this.y, this.width, this.height)
    this.ctx.stroke()

    if (this.dragged) {
      this.ctx.fillStyle = '#ccc'
      this.ctx.fill()
    } else {
      this.ctx.fillStyle = '#fff'
      this.ctx.fill()
    }

    this.ctx.font = '10px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText(
      this.name,
      this.x - this.name.length,
      this.y + this.height + 10
    )
    this.ctx.fillText(
      `Send: ${this.publishedMessages}`,
      this.x - `Send: ${this.publishedMessages}`.length,
      this.y + this.height + 20
    )

    for (const key in this.publishes) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#aaa'
      this.ctx.setLineDash([3, 3])
      this.ctx.lineWidth = 1
      this.ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2)
      this.ctx.lineTo(
        this.publishes[key].exchange.x,
        this.publishes[key].exchange.y
      )
      this.ctx.stroke()
    }
  }
}

export default Producer
