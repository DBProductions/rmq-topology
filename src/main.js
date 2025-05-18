import { createTopology, displayForm } from './utils/common'

import {
  mouseUpOnCanvas,
  mouseDownOnCanvas,
  mouseMoveOnCanvas,
  clickOnCanvas
} from './utils/canvas'

import {
  brokerDefaultSettings,
  getSettings,
  setSettings,
  displaySettings
} from './utils/settings'

import { Examples } from './examples'
import {} from './listener'

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

document.querySelector('#docLink').href = `${globalThis.location.href}doc`

const canvas = document.querySelector('#canvas')
canvas.width = globalThis.innerWidth
canvas.height = 480
const curCtx = canvas.getContext('2d')

// creates the scene with timer and bind it to the window object.
createTopology(curCtx, config)

canvas.addEventListener('mouseup', mouseUpOnCanvas)
canvas.addEventListener('mousedown', mouseDownOnCanvas)
canvas.addEventListener('mousemove', mouseMoveOnCanvas)
canvas.addEventListener('click', clickOnCanvas)

document.querySelector('#exampleTopology').addEventListener('change', (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('')
  let restart = false
  if (globalThis.timer.running) {
    globalThis.timer.stop()
    globalThis.scene.purge()
    globalThis.scene.render()
    restart = true
  }
  if (e.target.value !== 'Examples') {
    createTopology(curCtx, Examples[e.target.value.toLowerCase()])
    if (restart) {
      globalThis.timer.start()
    }
  } else {
    globalThis.scene.purge()
    globalThis.scene.description = ''
    globalThis.scene.render()
  }
})

const animateBtn = document.querySelector('#animate')
animateBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (animateBtn.innerHTML === '<i class="fas fa-play"></i> Start') {
    globalThis.timer.start()
    animateBtn.innerHTML = '<i class="fas fa-stop"></i> Stop'
  } else {
    globalThis.timer.stop()
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

document.querySelector('#importRmqBtn').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  const importStr = document.querySelector('#ImExport').value
  try {
    const topologyStr = {
      description: '',
      producers: [],
      consumers: [],
      exchanges: [],
      queues: [],
      bindings: []
    }
    const jsonStr = JSON.parse(importStr)
    let x = 400
    let y = 50
    let n = 1
    jsonStr.exchanges.forEach((v) => {
      if (
        !v.name.includes('federation') &&
        ['direct', 'fanout', 'topic'].includes(v.type)
      ) {
        let alternate = null
        if (v.arguments['alternate-exchange']) {
          alternate = v.arguments['alternate-exchange']
        }
        topologyStr.exchanges.push({
          x: x,
          y: y,
          name: v.name,
          type: v.type,
          alternate: alternate
        })
        y += 60
        n += 1
        if (n > 5) {
          n = 1
          y = 50
          x += 50
        }
      }
    })
    x = 800
    y = 50
    n = 1
    jsonStr.queues.forEach((v) => {
      if (!v.name.includes('federation')) {
        console.log(v.arguments)
        let ttl = null
        let dlx = null
        if (v.arguments['x-message-ttl']) {
          ttl = v.arguments['x-message-ttl']
        }
        if (v.arguments['x-dead-letter-exchange']) {
          dlx = topologyStr.exchanges.findIndex(
            (o) => o.name === v.arguments['x-dead-letter-exchange']
          )
        }
        topologyStr.queues.push({
          x: x,
          y: y,
          name: v.name,
          type: v.type,
          ttl: ttl,
          dlx: dlx,
          maxLength: ''
        })
        y += 60
        n += 1
        if (n > 5) {
          n = 1
          y = 50
          x += 80
        }
      }
    })

    jsonStr.bindings.forEach((v) => {
      if (v.destination_type === 'queue' && !v.source.includes('federation')) {
        const exchange = topologyStr.exchanges.findIndex(
          (o) => o.name === v.source
        )
        const queue = topologyStr.queues.findIndex(
          (o) => o.name === v.destination
        )
        if (exchange !== -1 && queue !== -1) {
          topologyStr.bindings.push({
            exchange: exchange,
            queue: queue,
            routingKey: v.routing_key
          })
        }
      }
    })
    createTopology(curCtx, topologyStr)
    document.querySelector('#imexportPanel').classList.remove('panel-wrap-out')
  } catch (e) {
    console.log(e)
    document.querySelector('#imexportErr').innerHTML = 'Parse error'
  }
})
