import Producer from '../producer'
import Consumer from '../consumer'
import Exchange from '../exchange'
import Queue from '../queue'
import Binding from '../binding'
import Scene from '../scene'
import Timer from '../timer'
import { displayProducer } from './producer'
import { displayConsumer } from './consumer'
import { displayExchange } from './exchange'
import { displayQueue } from './queue'
import { displayBinding } from './binding'

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
    // alternate exchanges
    const alternateExchanges = conf.exchanges.filter((s) => s.alternate)
    const currentExchanges = window.scene.getObjectsInScene('Exchange')
    alternateExchanges.forEach((ex) => {
      const e = currentExchanges.filter((s) => s.name == ex.name)[0]
      const a = currentExchanges.filter((s) => s.name == ex.alternate)[0]
      e.setAlternate(a)
    })
  }
  if (conf.queues) {
    conf.queues.forEach((queue) => {
      const newQueue = new Queue(
        queue.x,
        queue.y,
        queue.name,
        queue.type,
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
      const newProducer = new Producer(producer.x, producer.y, producer.name)
      const currentExchanges = window.scene.getObjectsInScene('Exchange')
      for (const val in producer.publishes) {
        currentExchanges.forEach((ex) => {
          if (ex.name === producer.publishes[val].exchange) {
            newProducer.addMessageToExchange(
              ex,
              producer.publishes[val].routingKey,
              producer.publishes[val].message
            )
          }
        })
      }
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

  window.scene.render()
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

/**
 * Decides which component have to be displayed to get created.
 *
 * @param {object} e - Event object
 */
const addNewComponent = (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm(e.target.value)
  switch (e.target.value) {
    case 'Producer':
      displayProducer()
      break
    case 'Consumer':
      displayConsumer()
      break
    case 'Exchange':
      displayExchange()
      break
    case 'Queue':
      displayQueue()
      break
    case 'Binding':
      displayBinding()
      break
    default:
      break
  }
  e.target.selectedIndex = 0
}

/**
 * Current mouse position inside of a cirle.
 * @param {object} val - can be Exchange or Queue object
 * @param {number} mx - x position of the mouse
 * @param {number} my - y position of the mouse
 * @returns {object}
 */
const findCircle = (val, mx, my) => {
  let found
  if (val.constructor.name === 'Exchange' || val.constructor.name === 'Queue') {
    const d = Math.floor(Math.sqrt((val.x - mx) ** 2 + (val.y - my) ** 2))
    if (d <= val.radius) {
      found = val
    }
  }
  return found
}

/**
 * Current mouse position inside of a square.
 * @param {object} val - can be Producer or Consumer object
 * @param {number} mx - x position of the mouse
 * @param {number} my - y position of the mouse
 * @returns {object}
 */
const findSquare = (val, mx, my) => {
  let found
  if (
    val.constructor.name === 'Producer' ||
    val.constructor.name === 'Consumer'
  ) {
    if (
      mx >= val.x &&
      mx <= val.x + val.width &&
      my >= val.y &&
      my <= val.y + val.height
    ) {
      found = val
    }
  }
  return found
}

/**
 * Current mouse position over a line.
 * @param {Binding} val - Binding object
 * @param {number} mx - x position of the mouse
 * @param {number} my - y position of the mouse
 * @returns {object}
 */
const findLine = (val, mx, my) => {
  let found
  const line = {
    x0: val.x1,
    x1: val.x2,
    y0: val.y1,
    y1: val.y2
  }

  let x1
  let x2
  if (line.x0 > line.x1) {
    x1 = line.x1
    x2 = line.x0
  } else {
    x1 = line.x0
    x2 = line.x1
  }
  if (mx > x1 && mx < x2) {
    // determine how close the mouse must be to the line
    // for the mouse to be inside the line
    const tolerance = 3
    const linepoint = linepointNearestMouse(line, mx, my)
    const dx = mx - linepoint.x
    const dy = my - linepoint.y
    const distance = Math.abs(Math.sqrt(dx * dx + dy * dy))
    if (distance < tolerance) {
      found = val
    }
  }
  return found
}

/**
 * Find the actor in the scene from the current mouse position.
 * @param {object} e - Event object
 * @param {*} line
 * @returns {object} - undefined or the found actor in scene
 */
const findPosition = (e, line = false) => {
  const mx = e.clientX - e.target.offsetLeft
  const my = e.clientY - e.target.offsetTop
  let obj
  window.scene.actors.forEach((val) => {
    const foundProducerConsumer = findSquare(val, mx, my)
    if (foundProducerConsumer) {
      obj = foundProducerConsumer
    }
    const foundExchangeQueue = findCircle(val, mx, my)
    if (foundExchangeQueue) {
      obj = foundExchangeQueue
    }
    if (line) {
      const foundLine = findLine(val, mx, my)
      if (foundLine) {
        obj = foundLine
      }
    }
  })
  return obj
}

export {
  linepointNearestMouse,
  createTopology,
  displayForm,
  addNewComponent,
  findCircle,
  findSquare,
  findLine,
  findPosition
}
