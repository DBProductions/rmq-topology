import {
  getSettings,
  setSettings,
  linepointNearestMouse,
  createTopology,
  displayForm,
  displayProducer,
  displayConsumer,
  displayExchange,
  displayQueue,
  displayBinding,
  displaySettings
} from './utils'

import { Examples } from './examples'
import {} from './listener'

const brokerDefaultSettings = {
  host: 'http://localhost:15672',
  vhost: '%2f',
  username: 'guest',
  password: 'guest'
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

document.querySelector('#newComponent').addEventListener('change', (e) => {
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
})

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
    switch (ele.constructor.name) {
      case 'Producer':
        displayForm(ele.constructor.name)
        displayProducer(ele)
        break
      case 'Exchange':
        displayForm(ele.constructor.name)
        displayExchange(ele)
        break
      case 'Queue':
        displayForm(ele.constructor.name)
        displayQueue(ele)
        break
      case 'Binding':
        displayForm(ele.constructor.name)
        displayBinding(ele)
        break
      case 'Consumer':
        displayForm(ele.constructor.name)
        displayConsumer(ele)
        break
      default:
        console.log(ele.constructor.name)
    }
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

const settingsBtn = document.querySelector('#settings')
settingsBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  displaySettings()
})

const exportBtn = document.querySelector('#export')
exportBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#importBtn').classList.remove('hidden')
  const exports = {
    description: '',
    producers: [],
    consumers: [],
    exchanges: [],
    queues: [],
    bindings: []
  }
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    exports.exchanges.push({
      x: val.x,
      y: val.y,
      name: val.name,
      type: val.type
    })
  })
  const queues = window.scene.getObjectsInScene('Queue')
  queues.forEach((val) => {
    const q = {
      x: val.x,
      y: val.y,
      name: val.name,
      ttl: val.ttl,
      maxLength: val.maxLength
    }
    if (val.dlx) {
      const exchangeIndex = exchanges.findIndex((e) => e.id === val.dlx.id)
      q.dlx = exchangeIndex
    }
    exports.queues.push(q)
  })
  const bindings = window.scene.getObjectsInScene('Binding')
  bindings.forEach((val) => {
    const exchangeIndex = exchanges.findIndex((e) => e.id === val.source.id)
    const queueIndex = queues.findIndex((q) => q.id === val.destination.id)
    if (exchangeIndex !== -1 && queueIndex !== -1) {
      exports.bindings.push({
        exchange: exchangeIndex,
        queue: queueIndex,
        routingKey: val.routingKey
      })
    }
  })
  const consumers = window.scene.getObjectsInScene('Consumer')
  consumers.forEach((val) => {
    const consumes = []
    val.queues.forEach((queue) => {
      const queueIndex = queues.findIndex((q) => q.id === queue.id)
      consumes.push(queueIndex)
    })
    exports.consumers.push({
      x: val.x,
      y: val.y,
      name: val.name,
      consumes,
      mode: val.mode
    })
  })
  const producers = window.scene.getObjectsInScene('Producer')
  producers.forEach((val) => {
    exports.producers.push({
      x: val.x,
      y: val.y,
      name: val.name,
      publishes: val.publishes,
      routingKey: val.routingKey
    })
  })

  document.querySelector('#ImExport').value = JSON.stringify(exports)
  document.querySelector('#imexportPanel').classList.add('panel-wrap-out')
})

document.querySelector('#copyBtn').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#ImExport').select()
  document.execCommand('copy')
})

const importBtn = document.querySelector('#importBtn')
importBtn.addEventListener('click', (e) => {
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

const cancelBtn = document.querySelector('#cancelBtn')
cancelBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#imexportPanel').classList.remove('panel-wrap-out')
})

const generateCurlBtn = document.querySelector('#generateCurl')
generateCurlBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { host } = brokerSettings
  const { username } = brokerSettings
  const { password } = brokerSettings
  const { vhost } = brokerSettings
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    const name = encodeURIComponent(val.name)
    generatedString += `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${host}/api/exchanges/${vhost}/${name} -d '{"type": "${val.type}", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}'\n\n`
  })
  const queues = window.scene.getObjectsInScene('Queue')
  queues.forEach((val) => {
    const name = encodeURIComponent(val.name)
    const args = {}
    if (val.dlx) {
      args['x-dead-letter-exchange'] = val.dlx.name
    }
    if (val.msgTtl) {
      args['x-message-ttl'] = val.msgTtl
    }
    if (val.maxLength) {
      args['x-max-length'] = val.maxLength
    }
    generatedString += `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${host}/api/queues/${vhost}/${name} -d '{"auto_delete": false, "durable": true, "arguments": ${JSON.stringify(
      args
    )}}'\n\n`
  })
  const bindings = window.scene.getObjectsInScene('Binding')
  bindings.forEach((val) => {
    const exchangeIndex = exchanges.findIndex((e) => e.id === val.source.id)
    const queueIndex = queues.findIndex((q) => q.id === val.destination.id)
    if (exchangeIndex !== -1 && queueIndex !== -1) {
      const exchange = exchanges[exchangeIndex]
      const queue = queues[queueIndex]
      generatedString += `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${host}/api/bindings/e/${encodeURIComponent(
        exchange.name
      )}/q/${encodeURIComponent(queue.name)} -d '{"routing_key": ${
        val.routingKey
      }, "arguments": {}}'\n\n`
    }
  })
  document.querySelector('#ImExport').value = generatedString
  document.querySelector('#imexportPanel').classList.add('panel-wrap-out')
})

const generateRmqBtn = document.querySelector('#generateRabbitmqadmin')
generateRmqBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { host } = brokerSettings
  const { username } = brokerSettings
  const { password } = brokerSettings
  let { vhost } = brokerSettings
  const url = new URL(host)
  if (vhost === '%2f') {
    vhost = '/'
  }
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    generatedString += `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare exchange name="${val.name}" type="${val.type}" durable=true\n\n`
  })
  const queues = window.scene.getObjectsInScene('Queue')
  queues.forEach((val) => {
    const args = {}
    if (val.dlx) {
      args['x-dead-letter-exchange'] = val.dlx.name
    }
    if (val.msgTtl) {
      args['x-message-ttl'] = val.msgTtl
    }
    if (val.maxLength) {
      args['x-max-length'] = val.maxLength
    }
    generatedString += `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare queue name="${val.name}" durable=true`
    if (Object.keys(args).length !== 0) {
      generatedString += ` arguments='${JSON.stringify(args)}'`
    }
    generatedString += '\n\n'
  })
  const bindings = window.scene.getObjectsInScene('Binding')
  bindings.forEach((val) => {
    const exchangeIndex = exchanges.findIndex((e) => e.id === val.source.id)
    const queueIndex = queues.findIndex((q) => q.id === val.destination.id)
    if (exchangeIndex !== -1 && queueIndex !== -1) {
      const exchange = exchanges[exchangeIndex]
      const queue = queues[queueIndex]
      generatedString += `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare binding source="${exchange.name}" destination_type="queue" destination="${queue.name}" routing_key="${val.routingKey}"\n\n`
    }
  })
  document.querySelector('#ImExport').value = generatedString
  document.querySelector('#imexportPanel').classList.add('panel-wrap-out')
})

const generateTfBtn = document.querySelector('#generateTerraform')
generateTfBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { host } = brokerSettings
  const { username } = brokerSettings
  const { password } = brokerSettings
  let { vhost } = brokerSettings
  if (vhost === '%2f') {
    vhost = '/'
  }
  generatedString += `terraform {
  required_providers {
    rabbitmq = {
      source = "cyrilgdn/rabbitmq"
      version = "1.5.1"
    }
  }
}
provider "rabbitmq" {
  endpoint = "${host}"
  username = "${username}"
  password = "${password}"
}
resource "rabbitmq_vhost" "vhost" {
  name = "${vhost}"
}
`
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    const name = val.name.replace(/ /g, '-')
    generatedString += `resource "rabbitmq_exchange" "${name}" {
  name  = "${val.name}"
  vhost = "\${rabbitmq_vhost.vhost.name}"
  settings {
    type        = "${val.type}"
    durable     = true
    auto_delete = false
  }
}
`
  })
  const queues = window.scene.getObjectsInScene('Queue')
  queues.forEach((val) => {
    const name = val.name.replace(/ /g, '-')
    if (val.dlx || val.msgTtl || val.maxlength) {
      generatedString += `variable "${name}args" {
    default = <<EOF
    {
`
      const extra = []
      if (val.dlx) {
        extra.push(`"x-dead-letter-exchange": "${val.dlx.name}"`)
      }
      if (val.msgTtl) {
        extra.push(`"x-message-ttl": ${val.msgTtl}`)
      }
      if (val.maxLength) {
        extra.push(`"x-max-length": ${val.maxLength}`)
      }
      generatedString += `        ${extra.join(',\n        ')}`
      generatedString += `
    }
    EOF
}
`
    }
    generatedString += `resource "rabbitmq_queue" "${name}" {
  name  = "${val.name}"
  vhost = "\${rabbitmq_vhost.vhost.name}"
    
  settings {
    durable     = true
    auto_delete = false`
    if (val.dlx || val.msgTtl || val.maxlength) {
      generatedString += `
    arguments_json = "\${var.${name}args}"`
    }
    generatedString += `
  }
}
`
  })

  const bindings = window.scene.getObjectsInScene('Binding')
  bindings.forEach((val) => {
    const srcName = val.source.name.replace(/ /g, '-')
    const destName = val.destination.name.replace(/ /g, '-')
    generatedString += `resource "rabbitmq_binding" "${srcName}${destName}" {
  source           = "\${rabbitmq_exchange.${srcName}.name}"
  vhost            = "\${rabbitmq_vhost.vhost.name}"
  destination      = "\${rabbitmq_queue.${destName}.name}"
  destination_type = "queue"
  routing_key      = "${val.routingKey}"
}
`
  })

  document.querySelector('#ImExport').value = generatedString
  document.querySelector('#importBtn').classList.add('hidden')
  document.querySelector('#imexportPanel').classList.add('panel-wrap-out')
})

const generateAsyncApiBtn = document.querySelector('#generateAsyncApi')
generateAsyncApiBtn.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  console.log('go')
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { host } = brokerSettings
  const { vhost } = brokerSettings

  generatedString += `asyncapi: 2.6.0
info:
  title: RabbitMQ Docs
  description: Documentation of broker.
  version: 0.1.0
servers:
  production:
    url: ${host}
    protocol: amqps
    protocolVersion: 0.9.1
    description: Production broker.
channels:
`;

  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    generatedString += `  ${val.name.replaceAll(' ', '_')}:
    publish:
      description: Exchange
      message:
        $ref: '#/components/messages/Event'
    bindings:
      amqp:
        exchange:
          name: ${val.name}
          type: ${val.type}
          durable: true
          autoDelete: false
          vhost: ${vhost}
`
  })

  generatedString += `components:
  messages:
    Event:
      description: Event
      headers:
        type: object
        properties:
          correlationId:
            description: Correlation ID set by application
            type: string
          applicationInstanceId:
            description: Unique identifier for a given instance of the publishing application
            type: string
      payload:
        type: object
        additionalProperties: false
        properties:
          created:
            type: string
            description: The date and time a message was sent.
            format: datetime
          name:
            type: string
            description: The name of the message was sent.
          value:
            type: string
            description: The value of the message was sent.`

  document.querySelector('#ImExport').value = generatedString
  document.querySelector('#imexportPanel').classList.add('panel-wrap-out')
})