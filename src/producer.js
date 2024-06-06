import BaseComponent from './basecomponent'
import ExchangeMessage from './messages/exchangemessage'

class Producer extends BaseComponent {
  /**
   * Producer class represents a component that publishs against exchanges.
   *
   * @param {number} x - x position of the producer
   * @param {number} y - y position of the producer
   * @param {string} name - optional identifier
   * @param {(object|Array)} publishes - list of exchanges to publish to
   * @extends BaseComponent
   */
  constructor(x, y, name, publishes) {
    super(x, y)
    this.name = name
    this.width = 20
    this.height = 20
    this.lastSpawn = +new Date()
    this.curTime = 0
    this.delayTime = 0
    this.curDelay = 0
    this.spawnTime = 1.0 // seconds
    this.fullSpawnTime = this.spawnTime

    var letters = '012345'.split('')
    var color = `#${letters[Math.round(Math.random() * 5)]}`
    letters = '0123456789ABCDEF'.split('')
    for (var i = 0; i < 5; i++) {
      color += letters[Math.round(Math.random() * 15)]
    }
    //this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    this.color = color

    this.publishedMessages = 0
    this.publishes = publishes || {}
    this.customHeaders = []
    this.debug = false
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
   * Adds a message to an exchange when the exchange exists.
   *
   * @param {Exchange} exchange - Exchange object
   * @param {Object} message - JSON message with headers and body
   */
  addMessageToExchange(exchange, routingKey, message) {
    if (!this.exchangeWithRoutingKeyExists(exchange, routingKey)) {
      this.publishes[Object.keys(this.publishes).length] = {
        exchange,
        routingKey,
        message
      }
    }
    if (Object.keys(this.publishes).length === 0) {
      this.publishes[Object.keys(this.publishes).length] = {
        exchange,
        routingKey,
        message
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
        this.publishes[key].message.headers['app-id'] = this.name
        this.publishes[key].message.headers['message-id'] = this.createUUID()

        new ExchangeMessage(
          this.x + this.width / 2,
          this.y + this.height / 2,
          this.publishes[key].exchange,
          this.publishes[key].routingKey,
          this.publishes[key].message,
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
