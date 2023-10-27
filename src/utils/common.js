import Producer from '../producer'
import Consumer from '../consumer'
import Exchange from '../exchange'
import Queue from '../queue'
import Binding from '../binding'
import Scene from '../scene'
import Timer from '../timer'

/**
 * Calculates the point on the line that's nearest to the mouse position.
 *
 * https://stackoverflow.com/questions/24043967/detect-if-mouse-is-over-an-object-inside-canvas
 * @param {object} line - line with start and end point (x1,y1,x2,y2)
 * @param {number} x - x position
 * @param {number} y - y position
 * @returns {object}
 */
const linepointNearestMouse = (line, x, y) => {
  const lerp = (a, b, c) => a + c * (b - a)
  const dx = line.x1 - line.x0
  const dy = line.y1 - line.y0
  const t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy)
  const lineX = lerp(line.x0, line.x1, t)
  const lineY = lerp(line.y0, line.y1, t)
  return {
    x: lineX,
    y: lineY
  }
}

/**
 * Creates the topology shown on the canvas.
 * A new scene with timer plus the parts defined in the configuration.
 *
 * @param {object} ctx - canvas context
 * @param {object} conf - configuration as JSON
 */
const createTopology = (ctx, conf) => {
  window.scene = new Scene(ctx, window.innerWidth, 450)
  if (conf.description) {
    window.scene.description = conf.description
  }
  window.timer = new Timer(window.scene)

  const exchanges = []
  const queues = []

  if (conf.exchanges) {
    conf.exchanges.forEach((exchange) => {
      const newExchange = new Exchange(
        exchange.x,
        exchange.y,
        exchange.name,
        exchange.type
      )
      newExchange.addToScene(window.scene)
      exchanges.push(newExchange)
    })
  }
  if (conf.queues) {
    conf.queues.forEach((queue) => {
      const newQueue = new Queue(
        queue.x,
        queue.y,
        queue.name,
        queue.ttl,
        exchanges[queue.dlx],
        queue.dlxrk,
        queue.maxLength
      )
      newQueue.addToScene(window.scene)
      queues.push(newQueue)
    })
  }
  if (conf.producers) {
    conf.producers.forEach((producer) => {
      const newProducer = new Producer(
        producer.x,
        producer.y,
        producer.name,
        producer.publishes,
        producer.routingKey
      )
      producer.publishes.forEach((val) => {
        newProducer.addExchange(exchanges[val])
      })
      newProducer.addToScene(window.scene)
    })
  }
  if (conf.consumers) {
    conf.consumers.forEach((consumer) => {
      const newConsumer = new Consumer(
        consumer.x,
        consumer.y,
        consumer.name,
        consumer.consumes,
        consumer.mode
      )
      consumer.consumes.forEach((val) => {
        newConsumer.addQueue(queues[val])
      })
      newConsumer.addToScene(window.scene)
    })
  }
  if (conf.bindings) {
    conf.bindings.forEach((binding) => {
      const newBinding = new Binding(
        exchanges[binding.exchange],
        queues[binding.queue],
        binding.routingKey
      )
      newBinding.addToScene(window.scene)
    })
  }

  window.scene.renderOnce()
}

/**
 * Adds the CSS class to the selected one and remove it from all other ones.
 *
 * @param {string} form
 */
const displayForm = (form) => {
  const formsCollection = document.getElementsByTagName('form')
  for (let i = 0; i < formsCollection.length; i += 1) {
    document
      .querySelector(`#${formsCollection[i].id}`)
      .parentNode.parentNode.classList.remove('panel-wrap-out')
    if (`${form.toLowerCase()}Form` === formsCollection[i].id) {
      document
        .querySelector(`#${formsCollection[i].id}`)
        .parentNode.parentNode.classList.add('panel-wrap-out')
    }
  }
}

export { linepointNearestMouse, createTopology, displayForm }
