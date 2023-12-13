import {
  createTopology,
  displayForm,
  addNewComponent,
  findCircle,
  findSquare,
  findLine,
  findPosition
} from './utils/common'

import { getSettings, setSettings, displaySettings } from './utils/settings'
import { displayProducer } from './utils/producer'
import { displayConsumer } from './utils/consumer'
import { displayExchange } from './utils/exchange'
import { displayQueue } from './utils/queue'
import { displayBinding } from './utils/binding'

import {
  exportTopology,
  exportCurl,
  exportRabbitmqadmin,
  exportTerraform,
  exportAsyncApi
} from './utils/exports'

import { Examples } from './examples'
import {} from './listener'

const brokerDefaultSettings = {
  host: 'localhost',
  port: 5672,
  management: `http://localhost:15672/api`,
  vhost: '%2f',
  username: 'guest',
  password: 'guest',
  asyncapi: {
    title: 'RabbitMQ',
    description: 'Broker description.',
    version: '0.0.1'
  }
}
if (getSettings() === null) {
  setSettings(brokerDefaultSettings)
}

const config = {
  description: 'RMQ Topology helps to simulate and visualize the message flow.',
  producers: [],
  consumers: [],
  exchanges: [],
  queues: [],
  bindings: []
}

document.querySelector('#docLink').href = `${window.location.href}doc`

const canvas = document.querySelector('#canvas')
canvas.width = window.innerWidth
canvas.height = 450
const curCtx = canvas.getContext('2d')

createTopology(curCtx, config)

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (!window.timer.running) {
    const ele = findPosition(e)
    if (ele) {
      ele.dragged = true
      ele.hover = false
    }
  }
})

canvas.addEventListener('mouseup', (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (!window.timer.running) {
    window.scene.actors.map((obj) => {
      obj.dragged = false
      return true
    })
    window.scene.renderOnce()
  }
})

canvas.addEventListener('mousemove', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.body.style.cursor = 'default'
  if (!window.timer.running) {
    const mx = e.clientX - e.target.offsetLeft
    const my = e.clientY - e.target.offsetTop

    const draggedActor = window.scene.actors.filter((a) => a.dragged === true)
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
      window.scene.actors.forEach((val) => {
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
    window.scene.renderOnce()
  }
})

canvas.addEventListener('click', (e) => {
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
})

document.querySelector('#exampleTopology').addEventListener('change', (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('')
  let restart = false
  if (window.timer.running) {
    window.timer.stop()
    window.scene.purge()
    window.scene.renderOnce()
    restart = true
  }
  if (e.target.value !== 'Examples') {
    createTopology(curCtx, Examples[e.target.value.toLowerCase()])
    if (restart) {
      window.timer.start()
    }
  } else {
    window.scene.purge()
    window.scene.description = ''
    window.scene.renderOnce()
  }
})

document
  .querySelector('#newComponent')
  .addEventListener('change', addNewComponent)

const animateBtn = document.querySelector('#animate')
animateBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (animateBtn.innerHTML === '<i class="fas fa-play"></i> Start') {
    window.timer.start()
    animateBtn.innerHTML = '<i class="fas fa-stop"></i> Stop'
  } else {
    window.timer.stop()
    animateBtn.innerHTML = '<i class="fas fa-play"></i> Start'
  }
})

document.querySelector('#settings').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('settingsForm')
  displaySettings()
})

document.querySelector('#copyBtn').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#ImExport').select()
  document.execCommand('copy')
})

document.querySelector('#cancelBtn').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#imexportPanel').classList.remove('panel-wrap-out')
})

document.querySelector('#importBtn').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  const importStr = document.querySelector('#ImExport').value
  try {
    const jsonStr = JSON.parse(importStr)
    createTopology(curCtx, jsonStr)
    document.querySelector('#imexportPanel').classList.remove('panel-wrap-out')
  } catch (e) {
    document.querySelector('#imexportErr').innerHTML = 'Parse error'
  }
})

// export
document.querySelector('#export').addEventListener('click', exportTopology)
document.querySelector('#generateCurl').addEventListener('click', exportCurl)
document
  .querySelector('#generateRabbitmqadmin')
  .addEventListener('click', exportRabbitmqadmin)
document
  .querySelector('#generateTerraform')
  .addEventListener('click', exportTerraform)
document
  .querySelector('#generateAsyncApi')
  .addEventListener('click', exportAsyncApi)
