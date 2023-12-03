import { displayForm } from './common'
import { getSettings } from './settings'

/**
 * Export topology as config.
 *
 * @param {object} e - Event object
 */
const exportTopology = (e) => {
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
    let alternate = null
    if (val.alternate) {
      alternate = val.alternate.name
    }
    exports.exchanges.push({
      x: val.x,
      y: val.y,
      name: val.name,
      type: val.type,
      alternate
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
    for (let key in val.publishes) {
      val.publishes[key].exchange = val.publishes[key].exchange.name
    }
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
}

/**
 * Export topology as curl statements.
 *
 * @param {object} e - Event object
 */
const exportCurl = (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('imexportForm')
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { management } = brokerSettings
  const { username } = brokerSettings
  const { password } = brokerSettings
  const { vhost } = brokerSettings
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    const name = encodeURIComponent(val.name)
    const args = {}
    if (val.alternate !== null) {
      args['alternate-exchange'] = val.alternate.name
    }
    generatedString += `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${management}/exchanges/${vhost}/${name} -d '{"type": "${val.type}", "auto_delete": false, "durable": true, "internal": false, "arguments": ${JSON.stringify(
      args
    )}}'\n\n`
  })
  const queues = window.scene.getObjectsInScene('Queue')
  queues.forEach((val) => {
    const name = encodeURIComponent(val.name)
    const args = {}
    if (val.dlx) {
      args['x-dead-letter-exchange'] = val.dlx.name
      args['x-dead-letter-routing-key'] = val.dlxrk
    }
    if (val.msgTtl) {
      args['x-message-ttl'] = val.msgTtl
    }
    if (val.maxLength) {
      args['x-max-length'] = val.maxLength
    }    
    generatedString += `curl -u ${username}:${password} -i -H "content-type:application/json" -XPUT ${management}/queues/${vhost}/${name} -d '{"auto_delete": false, "durable": true, "arguments": ${JSON.stringify(
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
      generatedString += `curl -u ${username}:${password} -i -H "content-type:application/json" -XPOST ${management}/bindings/${vhost}/e/${encodeURIComponent(
        exchange.name
      )}/q/${encodeURIComponent(queue.name)} -d '{"routing_key": ${
        val.routingKey
      }, "arguments": {}}'\n\n`
    }
  })
  document.querySelector('#ImExport').value = generatedString
  document.querySelector('#imexportPanel').classList.add('panel-wrap-out')
}

/**
 * Export topology as rabbitmqadmin statements.
 *
 * @param {object} e - Event object
 */
const exportRabbitmqadmin = (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('imexportForm')
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { management } = brokerSettings
  const { username } = brokerSettings
  const { password } = brokerSettings
  const url = new URL(management)
  let { vhost } = brokerSettings
  if (vhost === '%2f') {
    vhost = '/'
  }
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    generatedString += `rabbitmqadmin -H ${url.hostname} -u ${username} -p ${password} -V ${vhost} declare exchange `
    generatedString += `name="${val.name}" type="${val.type}" durable=true`
    if (val.alternate !== null) {      
      generatedString += ` arguments='${JSON.stringify({"alternate-exchange": val.alternate.name})}'`
    }
    generatedString += `\n\n`
  })
  const queues = window.scene.getObjectsInScene('Queue')
  queues.forEach((val) => {
    const args = {}
    if (val.dlx) {
      args['x-dead-letter-exchange'] = val.dlx.name
      args['x-dead-letter-routing-key'] = val.dlxrk
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
}

/**
 * Export topology as Terraform.
 *
 * @param {object} e - Event object
 */
const exportTerraform = (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('imexportForm')
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { management } = brokerSettings
  const { username } = brokerSettings
  const { password } = brokerSettings
  const url = new URL(management)
  let { vhost } = brokerSettings
  if (vhost === '%2f') {
    vhost = '/'
  }
  generatedString += `terraform {
  required_providers {
    rabbitmq = {
      source = "cyrilgdn/rabbitmq"
      version = "1.8.0"
    }
  }
}
provider "rabbitmq" {
  endpoint = "${url.origin}"
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
        extra.push(`"x-dead-letter-routing-key": "${val.dlxrk}"`)
      }
      if (val.msgTtl) {
        extra.push(`"x-message-ttl": ${val.msgTtl}`)
      }
      if (val.maxLength) {
        extra.push(`"x-max-length": ${val.maxLength}`)
      }
      generatedString += `    ${extra.join(',\n    ')}`
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
}

/**
 * Export topology as AsyncApi.
 *
 * @param {object} e - Event object
 */
const exportAsyncApi = (e) => {
  e.preventDefault()
  e.stopPropagation()
  displayForm('imexportForm')
  document.querySelector('#importBtn').classList.add('hidden')
  let generatedString = ''
  const brokerSettings = getSettings()
  const { host } = brokerSettings
  const { title, description } = brokerSettings.asyncapi
  let { vhost } = brokerSettings
  if (vhost === '%2f') {
    vhost = '/'
  }

  generatedString += `asyncapi: 2.6.0
info:
  title: ${title}
  description: ${description}
  termsOfService: https://asyncapi.org/terms/
  contact:
    name: API Support
    url: https://www.asyncapi.org/support
    email: support@asyncapi.org
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.htm
  version: 0.1.0
servers:
  production:
    url: ${host}
    protocol: amqps
    protocolVersion: 0.9.1
    description: Production broker.
    tags:
      - name: "env:production"
        description: "This environment is the live environment available for final users"
channels:
`
  const exchanges = window.scene.getObjectsInScene('Exchange')
  exchanges.forEach((val) => {
    if (val.type === 'topic') {
      val.bindings.forEach((v) => {
        if (v.routingKey !== '#') {
          generatedString += `  ${val.name.replaceAll(' ', '_')}/${v.routingKey}:
    subscribe:
      message:
        $ref: '#/components/messages/Event'
    publish:
      description: Exchange
      message:
        $ref: '#/components/messages/Event'
    bindings:
      amqp:
        exchange:
          name: ${v.source.name}
          type: topic
          durable: true
          autoDelete: false
          vhost: ${vhost}
        routingKey: ${v.routingKey}
        queue:
          name: ${v.destination.name}
          durable: true
          exclusive: true
          autoDelete: false
`
        }
      })
    } else {
      generatedString += `  ${val.name.replaceAll(' ', '_')}:
    subscribe:
      message:
        $ref: '#/components/messages/Event'
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
        queue:
          name: Test
          durable: true
          exclusive: true
          autoDelete: false
`
    }
  })
  // remove two to start again
  generatedString = generatedString.slice(0, -2)
  generatedString += `
components:
  messages:
    Event:
      name: EventName
      title: Event Title
      summary: Summary of the event.
      description: Event description
      contentType: application/json
      tags:
        - name: message
        - name: example
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
}

export { exportTopology, exportCurl, exportRabbitmqadmin, exportTerraform, exportAsyncApi }
