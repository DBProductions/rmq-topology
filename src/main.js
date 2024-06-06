import { createTopology, displayForm } from './utils/common'

import {
  mouseUpOnCanvas,
  mouseDownOnCanvas,
  mouseMoveOnCanvas,
  clickOnCanvas
} from './utils/canvas'

import { getSettings, setSettings, displaySettings } from './utils/settings'

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
