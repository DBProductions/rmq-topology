import BaseComponent from './basecomponent'
import ExchangeMessage from './messages/exchangemessage'
import QueueMessage from './messages/queuemessage'

class Queue extends BaseComponent {
  /**
   * Queue class represents a component which keeps the messages until they are consumed.
   *
   * @param {number} x - x position of the queue
   * @param {number} y - y position of the queue
   * @param {string} name - optional identifier
   * @param {string} type - optional identifier, `quorum` as default
   * @param {number} ttl - `x-message-ttl` Argument of the queue
   * @param {Exchange} dlx - Exchange object as `x-dead-letter-exchange` argument
   * @param {number} maxLength - `x-max-length` argument of the queue
   * @extends BaseComponent
   */
  constructor(x, y, name, type, ttl, dlx, dlxrk, maxLength) {
    super(x, y)
    this.name = name
    this.type = type || 'quorum'
    this.msgTtl = ttl || ''
    this.dlx = dlx
    this.dlxrk = dlxrk || ''
    this.maxLength = maxLength || ''
    this.radius = 20
    this.binding = null
    this.bindings = []
    this.consumers = []
    this.messages = []
  }

  /**
   * Adds a consumer to the queue.
   *
   * @param {Consumer} consumer - Consumer object
   */
  addConsumer(consumer) {
    if (this.consumers.findIndex((c) => c === consumer) === -1) {
      this.consumers.push(consumer)
    }
    // consumer added then deliver messages if present
    if (this.messages.length > 0) {
      if (this.type !== 'stream') {
        this.messages.forEach((val) => {
          val.msg.setConsumer(consumer)
        })
        this.messages = []
      } else {
        const clonedMessages = this.messages.map((a) => ({ ...a }))
        clonedMessages.forEach((val) => {
          val.msg.setConsumer(consumer)
        })
      }
    }
  }

  /**
   * Removes a consumer from the queue.
   *
   * @param {Consumer} consumer - Consumer object
   */
  removeConsumer(consumer) {
    const consumerIndex = this.consumers.findIndex((c) => c === consumer)
    if (consumerIndex !== -1) {
      if (this.consumers.length > 1) {
        this.consumers.splice(consumerIndex, 1)
      } else {
        this.consumers = []
      }
    }
  }

  /**
   * Handler for arriving messages.
   *
   * @param {QueueMessage} msg - QueueMessage object
   */
  messageArrived(msg) {
    const { fillStyle } = msg
    if (msg.constructor.name === 'RejectMessage') {
      if (this.dlx) {
        new ExchangeMessage(
          this.x,
          this.y,
          this.dlx,
          this.dlxrk,
          msg.message,
          true,
          undefined,
          fillStyle
        ).addToScene(this.scene)
      } else {
        this.scene.lostMessages += 1
      }
    } else {
      // stream or no consumer, message stays in the queue
      if (this.type === 'stream') {
        // deliver message to all consumer
        this.consumers.forEach((v) => {
          new QueueMessage(this.x, this.y, this, v, fillStyle).addToScene(
            this.scene
          )
        })
        this.messages.push({
          ts: Date.now(),
          msg: new QueueMessage(
            this.x,
            this.y,
            this,
            null,
            fillStyle
          ).addToScene(this.scene)
        })
      } else if (this.consumers.length === 0) {
        this.messages.push({
          ts: Date.now(),
          msg: new QueueMessage(
            this.x,
            this.y,
            this,
            null,
            fillStyle
          ).addToScene(this.scene)
        })
      } else {
        // deliver message random to one of the consumer
        new QueueMessage(
          this.x,
          this.y,
          this,
          this.consumers[Math.floor(Math.random() * this.consumers.length)],
          fillStyle
        ).addToScene(this.scene)
      }
      // max-length
      if (this.maxLength !== '' && this.maxLength < this.messages.length) {
        this.messages.pop()
        if (this.dlx) {
          new ExchangeMessage(
            this.x,
            this.y,
            this.dlx,
            this.dlxrk,
            msg.message,
            fillStyle
          ).addToScene(this.scene)
        }
      }
    }
    this.scene.removeActor(msg)
  }

  update() {
    if (this.msgTtl > 0) {
      const now = Date.now()
      const msgToRemove = []
      this.messages.forEach((val, i) => {
        if (now - val.ts >= this.msgTtl) {
          msgToRemove.push(i)
        }
      })
      msgToRemove.forEach((val) => {
        //console.log(val)
        if (this.dlx) {
          new ExchangeMessage(this.x, this.y, this.dlx, this.dlxrk).addToScene(
            this.scene
          )
        } else {
          this.scene.lostMessages += 1
        }
        this.messages.splice(val, 1)
      })
    }
  }

  render() {
    // shadow
    this.ctx.globalAlpha = 0.4
    this.ctx.beginPath()
    this.ctx.fillStyle = '#000'
    this.ctx.roundRect(this.x - 23, this.y - 12, 50, 30, [10])
    this.ctx.fill()

    this.ctx.globalAlpha = 1.0
    this.ctx.beginPath()
    // this.ctx.fillStyle = gradient;
    if (this.type === 'stream') {
      this.ctx.fillStyle = '#eee'
    } else {
      this.ctx.fillStyle = '#ccc'
    }
    this.ctx.setLineDash([])
    this.ctx.roundRect(this.x - 25, this.y - 15, 50, 30, [10])
    this.ctx.fill()

    if (this.dragged) {
      this.ctx.stroke()
    }

    if (this.hover) {
      this.ctx.stroke()
    }

    if (this.dlx) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#000'
      this.ctx.setLineDash([3, 3])
      this.ctx.lineWidth = 1
      this.ctx.moveTo(this.x, this.y)
      this.ctx.lineTo(this.dlx.x, this.dlx.y)
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
      `${this.messages.length} msgs`,
      this.x - `${this.messages.length} msgs`.length,
      this.y + this.radius + 20
    )
    if (this.msgTtl !== '') {
      this.ctx.fillText(
        `ttl: ${this.msgTtl}`,
        this.x - `ttl: ${this.msgTtl}`.length,
        this.y + this.radius + 30
      )
    }
    if (this.maxLength !== '') {
      this.ctx.fillText(
        `max: ${this.maxLength}`,
        this.x - `max: ${this.maxLength}`.length,
        this.y + this.radius + 30
      )
    }
  }
}

export default Queue
