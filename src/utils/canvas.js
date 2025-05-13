import {
  displayForm,
  findCircle,
  findSquare,
  findLine,
  findPosition
} from './common'

import { displayProducer } from './producer'
import { displayConsumer } from './consumer'
import { displayExchange } from './exchange'
import { displayQueue } from './queue'
import { displayBinding } from './binding'

/**
 * Handles mouse up event on the canvas to stop dragging of actors.
 *
 * @param {object} e - Event object
 */
const mouseUpOnCanvas = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (!globalThis.timer.running) {
    globalThis.scene.actors.map((obj) => {
      obj.dragged = false
      return true
    })
    globalThis.scene.render()
  }
}

/**
 * Handles mouse down event on the canvas to start dragging without hover effect of actors.
 *
 * @param {object} e - Event object
 */
const mouseDownOnCanvas = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (!globalThis.timer.running) {
    const ele = findPosition(e)
    if (ele) {
      ele.dragged = true
      ele.hover = false
    }
  }
}

/**
 * Handles mouse move event on the canvas to dragged actor.
 *
 * @param {object} e - Event object
 */
const mouseMoveOnCanvas = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.body.style.cursor = 'default'
  if (!globalThis.timer.running) {
    const mx = e.clientX - e.target.offsetLeft
    const my = e.clientY - e.target.offsetTop

    const draggedActor = globalThis.scene.actors.filter(
      (a) => a.dragged === true
    )
    if (draggedActor.length > 0) {
      const actor = draggedActor[0]
      document.body.style.cursor = 'pointer'
      if (actor.constructor.name === 'Producer') {
        actor.x = mx - actor.width / 2
        actor.y = my - actor.height / 2
      } else if (actor.constructor.name === 'Consumer') {
        actor.x = mx - actor.width / 2
        actor.y = my - actor.height / 2
      } else {
        actor.x = mx
        actor.y = my
      }
      if (actor.binding) {
        if (actor.binding.source === actor) {
          actor.bindings.forEach((binding) => {
            binding.x1 = mx
            binding.y1 = my
          })
        }
        if (actor.binding.destination === actor) {
          actor.bindings.forEach((binding) => {
            binding.x2 = mx
            binding.y2 = my
          })
        }
      }
    } else {
      globalThis.scene.actors.forEach((val) => {
        val.hover = false
        const foundProducerConsumer = findSquare(val, mx, my)
        if (foundProducerConsumer) {
          document.body.style.cursor = 'pointer'
          val.hover = true
        }
        const foundExchangeQueue = findCircle(val, mx, my)
        if (foundExchangeQueue) {
          document.body.style.cursor = 'pointer'
          val.hover = true
        }

        if (val.constructor.name === 'Binding') {
          const foundLine = findLine(val, mx, my)
          if (foundLine) {
            document.body.style.cursor = 'pointer'
            val.hover = true
          }
        }
      })
    }
    globalThis.scene.render()
  }
}

/**
 * Handles click event on the canvas and displays the specific Form to edit the component.
 *
 * @param {object} e - Event object
 */
const clickOnCanvas = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const ele = findPosition(e, true)
  if (ele && ele.constructor) {
    displayForm(ele.constructor.name)
    switch (ele.constructor.name) {
      case 'Producer':
        displayProducer(ele)
        break
      case 'Exchange':
        displayExchange(ele)
        break
      case 'Queue':
        displayQueue(ele)
        break
      case 'Binding':
        displayBinding(ele)
        break
      case 'Consumer':
        displayConsumer(ele)
        break
      default:
        console.log(ele.constructor.name)
    }
  }
}

export { mouseUpOnCanvas, mouseDownOnCanvas, mouseMoveOnCanvas, clickOnCanvas }
