import BaseComponent from './basecomponent'
import ExchangeMessage from './exchangemessage'

class Producer extends BaseComponent {
  /**
   * Producer class represents a component to publish against exchanges.
   * @param {number} x - x position of the producer
   * @param {number} y - y position of the producer
   * @param {string} name - optional identifier
   * @param {(object|Array)} publishes - list of exchanges to publish to
   * @param {string} routingKey - used routing key
   * @extends BaseComponent
   */
  constructor(x, y, name, publishes, routingKey) {
    super(x, y)
    this.name = name
    this.width = 20
    this.height = 20
    this.lastSpawn = +new Date()
    this.curTime = 0
    this.delayTime = 0
    this.curDelay = 0
    this.spawnTime = 1.2 // seconds
    this.fullSpawnTime = this.spawnTime
    this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

    this.routingKey = routingKey || 'x.x.x'
    this.publishedMessages = 0
    this.publishes = publishes
    this.exchanges = []
    this.debug = false
  }

  /**
   * Adds the exchange to the list when not already present
   * @param {Exchange} exchange - Exchange object
   */
  addExchange(exchange) {
    const exchangeIndex = this.exchanges.findIndex((e) => e === exchange)
    if (exchangeIndex === -1) {
      this.exchanges.push(exchange)
    }
  }

  /**
   * Removes the exchange from the list.
   * @param {Exchange} exchange - Exchange object
   */
  removeExchange(exchange) {
    const exchangeIndex = this.exchanges.findIndex((e) => e === exchange)
    if (exchangeIndex !== -1) {
      if (this.exchanges.length === 1) {
        this.exchanges = []
      } else {
        this.exchanges.splice(exchangeIndex, 1)
      }
    }
  }

  /**
   * Determines at which time a new message should be created.
   * @param {number} dt - delta time from the timer
   */
  update(dt) {
    this.spawnTime -= dt
    if (this.spawnTime < 0) {
      this.exchanges.forEach((val) => {
        new ExchangeMessage(
          this.x + this.width / 2,
          this.y + this.height / 2,
          val,
          this.routingKey,
          undefined,
          undefined,
          this.color
        ).addToScene(this.scene)
        this.publishedMessages += 1
      })
      this.spawnTime = this.fullSpawnTime
    }
  }

  render() {
    this.ctx.setLineDash([])
    // shadow
    this.ctx.globalAlpha = 0.4;
    this.ctx.beginPath()
    this.ctx.fillStyle = '#000'
    this.ctx.rect(this.x + 2, this.y + 2, this.width, this.height)
    this.ctx.fill()

    this.ctx.globalAlpha = 1.0;
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
    this.ctx.fillText(
      this.routingKey,
      this.x - this.routingKey.length,
      this.y + this.height + 30
    )

    this.exchanges.forEach((val) => {
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#aaa'
      this.ctx.setLineDash([3, 3])
      this.ctx.lineWidth = 1
      this.ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2)
      this.ctx.lineTo(val.x, val.y)
      this.ctx.stroke()
    })
  }
}

export default Producer
