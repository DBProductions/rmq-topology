import Producer from './producer'
import Consumer from './consumer'
import Exchange from './exchange'
import Queue from './queue'
import Binding from './binding'
import Scene from './scene'
import Timer from './timer'

/**
 * Gets the settings from loacalStorage and parse it as JSON.
 *
 * @returns {object}
 */
const getSettings = () => {
  const data = localStorage.getItem('rmqSettings')
  return JSON.parse(data)
}

/**
 * Sets the current settings in localStorage.
 *
 * @param {object} settings - settings as JSON to set in localStorage.
 */
const setSettings = (settings) => {
  localStorage.setItem('rmqSettings', JSON.stringify(settings))
}

/**
 * Hide and show tab links and the content for it.
 *
 * @param {Object} Event
 */
const changeSettingsTab = (e) => {
  e.preventDefault()
  try {
    const link = document.querySelector(`#settingsTabHref${e.target.innerHTML}`)
    if (link) {
      const tabLinks = document.querySelector('#settingsTabs')
      const liList = tabLinks.getElementsByTagName('li')
      for (let i in liList) {
        if (liList[i].classList) {
          liList[i].classList.remove('selected')
        }
      }

      const tabContent = document.querySelectorAll('#tabContainer > div')
      for (let d in tabContent) {
        if (tabContent[d].classList) {
          tabContent[d].classList.add('tab-hidden')
        }
      }

      link.classList.add('selected')
      document
        .querySelector(`#settingsTab${e.target.innerHTML}`)
        .classList.remove('tab-hidden')
    }
  } catch (err) {
    return
  }
}

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

/**
 * Display the form to create or edit a producer component.
 *
 * @param {Producer} producer - Producer object
 */
const displayProducer = (producer) => {
  document.querySelector('#deleteProducerForm').classList.add('hidden')
  document.querySelector('#producerPanel').classList.add('panel-wrap-out')

  document.querySelector('#producerIdField').value = ''
  document.querySelector('#producerNameField').value = ''
  document.querySelector('#producerRoutingKeyField').value = ''
  document.querySelector('#producerPublishTo').innerHTML = ''

  const exchanges = window.scene.getObjectsInScene('Exchange')
  refreshPublishToSelect(producer, exchanges)
  /*
  const selectSource = document.getElementById('producerPublishToSelect')
  selectSource.options.length = 0
  selectSource.options[selectSource.options.length] = new Option('---', 0)
  Object.keys(exchanges).forEach((exchange) => {
    if (producer && producer.exchanges) {
      const presentExchanges = producer.exchanges.findIndex(
        (s) => s.id === exchanges[exchange].id
      )
      if (presentExchanges === -1) {
        selectSource.options[selectSource.options.length] = new Option(
          exchanges[exchange].name,
          exchanges[exchange].id
        )
      }
    } else {
      selectSource.options[selectSource.options.length] = new Option(
        exchanges[exchange].name,
        exchanges[exchange].id
      )
    }
  })
  */

  if (producer) {
    document.querySelector('#deleteProducerForm').classList.remove('hidden')
    document.querySelector('#producerIdField').value = producer.id
    document.querySelector('#producerNameField').value = producer.name
    document.querySelector('#producerRoutingKeyField').value =
      producer.routingKey
    let exchangesDom = ''
    producer.exchanges.forEach((exchange) => {
      exchangesDom += `<div id="${exchange.id}" class="row">`
      exchangesDom += `<input type="hidden" name="producerExchanges[]" value="${exchange.id}">`
      exchangesDom += `<div class="flex-left">${exchange.name}</div>`
      exchangesDom += `<div class="flex-right"><a href="#" data-id="${exchange.id}" class="exchangeDeleteLink">&times;</a></div>`
      exchangesDom += '</div>'
    })
    document.querySelector('#producerPublishTo').innerHTML = exchangesDom
    document.querySelectorAll('.exchangeDeleteLink').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.target.parentNode.parentNode.remove()
        console.log('here')
        refreshPublishToSelect(producer, exchanges)
      })
    })
  }
}

/**
 *
 *
 */
const refreshPublishToSelect = (producer, exchanges) => {
  const selectSource = document.getElementById('producerPublishToSelect')
  selectSource.options.length = 0
  selectSource.options[selectSource.options.length] = new Option('---', 0)
  Object.keys(exchanges).forEach((exchange) => {
    if (producer && producer.exchanges) {
      const presentExchanges = producer.exchanges.findIndex(
        (s) => s.id === exchanges[exchange].id
      )
      if (presentExchanges === -1) {
        selectSource.options[selectSource.options.length] = new Option(
          exchanges[exchange].name,
          exchanges[exchange].id
        )
      }
    } else {
      selectSource.options[selectSource.options.length] = new Option(
        exchanges[exchange].name,
        exchanges[exchange].id
      )
    }
  })
}

/**
 * Sends the form to create or edit a producer component.
 *
 * @param {object} e - Event object
 */
const sendProducerForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#producerIdField').value
  const name = document.querySelector('#producerNameField').value
  const routingKey = document.querySelector('#producerRoutingKeyField').value
  const publishTo = document.querySelector('#producerPublishToSelect').value

  if (id) {
    const producer = window.scene.getIdInScene(id)

    const exchanges = document.getElementsByName('producerExchanges[]')
    const idsToKeep = []
    exchanges.forEach((exchange) => {
      idsToKeep.push(exchange.value)
    })
    const restExchanges = producer.exchanges.filter(
      (s) => idsToKeep.indexOf(s.id) !== -1
    )
    const removeExchanges = producer.exchanges.filter(
      (s) => idsToKeep.indexOf(s.id) === -1
    )
    removeExchanges.forEach((rmExchange) => {
      const exchange = window.scene.getIdInScene(rmExchange.id)
      producer.removeExchange(exchange)
    })

    producer.name = name
    producer.routingKey = routingKey
    producer.exchanges = restExchanges
    if (publishTo !== '0') {
      producer.addExchange(window.scene.getIdInScene(publishTo))
    }
  } else {
    const Producer1 = new Producer(200, 30, name, 0, routingKey)
    Producer1.addToScene(window.scene)
    if (publishTo !== '0') {
      Producer1.addExchange(window.scene.getIdInScene(publishTo))
    }
  }

  window.scene.renderOnce()

  document.querySelector('#producerIdField').value = ''
  document.querySelector('#producerNameField').value = ''
  document.querySelector('#producerRoutingKeyField').value = ''
  document.querySelector('#producerPanel').classList.remove('panel-wrap-out')
}

/**
 * Reset form values and remove CSS class from the producer panel.
 *
 * @param {object} e - Event object
 */
const hideProducer = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#producerIdField').value = ''
  document.querySelector('#producerNameField').value = ''
  document.querySelector('#producerRoutingKeyField').value = ''
  document.querySelector('#producerPanel').classList.remove('panel-wrap-out')
}

/**
 * Remove producer from the scene, render and remove CSS class from the producer panel.
 *
 * @param {object} e - Event object
 */
const deleteProducerForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#producerIdField').value
  const actor = window.scene.getIdInScene(id)
  window.scene.removeActor(actor)
  window.scene.renderOnce()
  document.querySelector('#producerPanel').classList.remove('panel-wrap-out')
}

/**
 * Display the form to create or edit consumer component.
 *
 * @param {Consumer} consumer - Consumer object
 */
const displayConsumer = (consumer) => {
  document.querySelector('#deleteConsumerForm').classList.add('hidden')
  document.querySelector('#consumerPanel').classList.add('panel-wrap-out')

  document.querySelector('#consumerIdField').value = ''
  document.querySelector('#consumerNameField').value = ''
  document.querySelector('#consumerConsumesFrom').innerHTML = ''

  const queues = window.scene.getObjectsInScene('Queue')
  const selectSource = document.querySelector('#consumerConsumesFromSelect')
  selectSource.options.length = 0
  selectSource.options[selectSource.options.length] = new Option('---', 0)
  Object.keys(queues).forEach((queue) => {
    if (consumer && consumer.queues) {
      const presentQueue = consumer.queues.findIndex(
        (s) => s.id === queues[queue].id
      )
      if (presentQueue === -1) {
        selectSource.options[selectSource.options.length] = new Option(
          queues[queue].name,
          queues[queue].id
        )
      }
    } else {
      selectSource.options[selectSource.options.length] = new Option(
        queues[queue].name,
        queues[queue].id
      )
    }
  })

  if (consumer) {
    document.querySelector('#deleteConsumerForm').classList.remove('hidden')
    document.querySelector('#consumerIdField').value = consumer.id
    document.querySelector('#consumerNameField').value = consumer.name

    const modes = document.getElementsByName('consumerMode')
    modes.forEach((val) => {
      if (consumer.mode === val.value) {
        // eslint-disable-next-line no-param-reassign
        val.checked = true
      }
    })

    let queuesDom = ''
    consumer.queues.forEach((queue) => {
      queuesDom += `<div id="${queue.id}" class="row">`
      queuesDom += `<input type="hidden" name="consumerQueues[]" value="${queue.id}">`
      queuesDom += `<div class="flex-left">${queue.name}</div>`
      queuesDom += `<div class="flex-right"><a href="#" data-id="${queue.id}" class="queueDeleteLink">&times;</a></div>`
      queuesDom += '</div>'
    })
    document.querySelector('#consumerConsumesFrom').innerHTML = queuesDom
    document.querySelectorAll('.queueDeleteLink').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.target.parentNode.parentNode.remove()
      })
    })
  }
}

/**
 * Reset form values and remove CSS class from the consumer panel.
 *
 * @param {object} e - Event object
 */
const hideConsumer = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#consumerIdField').value = ''
  document.querySelector('#consumerNameField').value = ''
  document.querySelector('#consumerPanel').classList.remove('panel-wrap-out')
}

/**
 * Sends the form to create or edit a consumer component.
 * @param {object} e - Event object
 */
const sendConsumerForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#consumerIdField').value
  const name = document.querySelector('#consumerNameField').value
  const modes = document.getElementsByName('consumerMode')
  const consumesFrom = document.querySelector(
    '#consumerConsumesFromSelect'
  ).value

  let mode
  modes.forEach((val) => {
    if (val.checked) {
      mode = val.value
    }
  })

  if (id) {
    const consumer = window.scene.getIdInScene(id)

    const queues = document.getElementsByName('consumerQueues[]')
    const idsToKeep = []
    queues.forEach((queue) => {
      idsToKeep.push(queue.value)
    })
    const restQueues = consumer.queues.filter(
      (s) => idsToKeep.indexOf(s.id) !== -1
    )
    const removeQueues = consumer.queues.filter(
      (s) => idsToKeep.indexOf(s.id) === -1
    )
    removeQueues.forEach((rmQueue) => {
      const actor = window.scene.getIdInScene(rmQueue.id)
      actor.removeConsumer(consumer)
    })

    consumer.name = name
    consumer.mode = mode
    consumer.queues = restQueues

    if (consumesFrom !== '0') {
      consumer.addQueue(window.scene.getIdInScene(consumesFrom))
    }
  } else {
    const Consumer1 = new Consumer(800, 30, name, [])
    Consumer1.addToScene(window.scene)
    if (consumesFrom !== '0') {
      Consumer1.addQueue(window.scene.getIdInScene(consumesFrom))
    }
  }

  window.scene.renderOnce()

  document.querySelector('#consumerIdField').value = ''
  document.querySelector('#consumerNameField').value = ''
  document.querySelector('#consumerPanel').classList.remove('panel-wrap-out')
}

/**
 * Remove consumer from the scene, render and remove CSS class from the consumer panel.
 *
 * @param {object} e - Event object
 */
const deleteConsumerForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#consumerIdField').value
  const consumer = window.scene.getIdInScene(id)
  consumer.queues.forEach((rmQueue) => {
    const actor = window.scene.getIdInScene(rmQueue.id)
    actor.removeConsumer(consumer)
  })

  window.scene.removeActor(consumer)
  window.scene.renderOnce()
  document.querySelector('#consumerPanel').classList.remove('panel-wrap-out')
}

/**
 * Display the form to create or edit exchange component.
 *
 * @param {Exchange} exchange - Exchange object
 */
const displayExchange = (exchange) => {
  document.querySelector('#deleteExchangeForm').classList.add('hidden')
  document.querySelector('#exchangePanel').classList.add('panel-wrap-out')

  document.querySelector('#exchangeErr').innerHTML = ''
  document.querySelector('#exchangeIdField').value = ''
  document.querySelector('#exchangeNameField').value = ''
  document.querySelector('#exchangeTypeSelect').value = 'direct'
  if (exchange) {
    document.querySelector('#deleteExchangeForm').classList.remove('hidden')
    document.querySelector('#exchangeIdField').value = exchange.id
    document.querySelector('#exchangeNameField').value = exchange.name
    document.querySelector('#exchangeTypeSelect').value = exchange.type
  }
}

/**
 * Sends the form to create or edit an exchange component.
 *
 * @param {object} e - Event object
 */
const sendExchangeForm = (e) => {
  e.preventDefault()
  e.stopPropagation()

  const id = document.querySelector('#exchangeIdField').value
  const name = document.querySelector('#exchangeNameField').value
  const type = document.querySelector('#exchangeTypeSelect').value
  let error = false

  if (name === '') {
    error = 'Name is required.'
    document.querySelector('#exchangeErr').innerHTML = error
  } else if (id) {
    const exchanges = window.scene.getObjectsInScene('Exchange')
    const exchangeIndex = exchanges.findIndex((e) => e.name === name)
    if (exchangeIndex === -1) {
      const exchange = window.scene.getIdInScene(id)
      exchange.name = name
      exchange.type = type
    } else {
      error = `Exchange with name '${name}' already exists.`
      document.querySelector('#exchangeErr').innerHTML = error
    }
  } else {
    const exchanges = window.scene.getObjectsInScene('Exchange')
    const exchangeIndex = exchanges.findIndex((e) => e.name === name)
    if (exchangeIndex === -1) {
      const Exchange1 = new Exchange(400, 30, name, type)
      Exchange1.addToScene(window.scene)
    } else {
      error = `Exchange with name '${name}' already exists.`
      document.querySelector('#exchangeErr').innerHTML = error
    }
  }

  window.scene.renderOnce()

  if (!error) {
    document.querySelector('#exchangeIdField').value = ''
    document.querySelector('#exchangeNameField').value = ''
    document.querySelector('#exchangeTypeSelect').value = 'direct'
    document.querySelector('#exchangePanel').classList.remove('panel-wrap-out')
  }
}

/**
 * Reset form values and remove CSS class from the exchange panel.
 *
 * @param {object} e - Event object
 */
const hideExchange = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#exchangeIdField').value = ''
  document.querySelector('#exchangeNameField').value = ''
  document.querySelector('#exchangeTypeSelect').value = 'direct'
  document.querySelector('#exchangePanel').classList.remove('panel-wrap-out')
}

/**
 * Remove exchange from the scene, render and remove CSS class from the exchange panel.
 *
 * @param {object} e - Event object
 */
const deleteExchangeForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#exchangeIdField').value
  const actor = window.scene.getIdInScene(id)
  window.scene.removeActor(actor)
  window.scene.renderOnce()
  document.querySelector('#exchangePanel').classList.remove('panel-wrap-out')
}

/**
 * Display the form to create or edit queue component.
 *
 * @param {Queue} queue - Queue object
 */
const displayQueue = (queue) => {
  document.querySelector('#deleteQueueForm').classList.add('hidden')
  document.querySelector('#queuePanel').classList.add('panel-wrap-out')

  document.querySelector('#queueErr').innerHTML = ''
  document.querySelector('#queueIdField').value = ''
  document.querySelector('#queueNameField').value = ''
  document.querySelector('#queueMsgTtlField').value = ''
  document.querySelector('#queueMaxLengthField').value = ''

  let dlx = { id: null }
  if (queue) {
    document.querySelector('#deleteQueueForm').classList.remove('hidden')
    document.querySelector('#queueIdField').value = queue.id
    document.querySelector('#queueNameField').value = queue.name
    document.querySelector('#queueMsgTtlField').value = queue.msgTtl
    document.querySelector('#queueMaxLengthField').value = queue.maxLength
    if (queue.dlx) {
      dlx = queue.dlx
    }
  }

  const exchanges = window.scene.getObjectsInScene('Exchange')
  const selectDlx = document.querySelector('#queueDlxSelect')
  selectDlx.options.length = 0
  selectDlx.options[selectDlx.options.length] = new Option(
    'Dead Letter Exchange',
    0
  )
  Object.keys(exchanges).forEach((exchange) => {
    if (dlx.id === exchanges[exchange].id) {
      selectDlx.options[selectDlx.options.length] = new Option(
        exchanges[exchange].name,
        exchanges[exchange].id,
        false,
        true
      )
    } else {
      selectDlx.options[selectDlx.options.length] = new Option(
        exchanges[exchange].name,
        exchanges[exchange].id
      )
    }
  })
}

/**
 * Sends the form to create or edit an queue component.
 *
 * @param {object} e - Event object
 */
const sendQueueForm = (e) => {
  e.preventDefault()
  e.stopPropagation()

  const id = document.querySelector('#queueIdField').value
  const name = document.querySelector('#queueNameField').value
  const msgTtl = document.querySelector('#queueMsgTtlField').value
  const dlx = document.querySelector('#queueDlxSelect').value
  const maxLength = document.querySelector('#queueMaxLengthField').value
  let error = false

  if (name === '') {
    error = 'Name is required.'
    document.querySelector('#queueErr').innerHTML = error
  } else if (id) {
    const queue = window.scene.getIdInScene(id)
    queue.name = name
    queue.msgTtl = msgTtl
    queue.maxLength = maxLength
    queue.dlx = window.scene.getIdInScene(dlx)
  } else {
    const queues = window.scene.getObjectsInScene('Queue')
    const queueIndex = queues.findIndex((q) => q.name === name)
    if (queueIndex === -1) {
      const Queue1 = new Queue(650, 30, name)
      Queue1.addToScene(window.scene)
      Queue1.msgTtl = msgTtl
      Queue1.dlx = window.scene.getIdInScene(dlx)
    } else {
      error = `Queue with name '${name}' already exists.`
      document.querySelector('#queueErr').innerHTML = error
    }
  }

  window.scene.renderOnce()

  if (!error) {
    document.querySelector('#queueIdField').value = ''
    document.querySelector('#queueNameField').value = ''
    document.querySelector('#queueMsgTtlField').value = ''
    document.querySelector('#queueMaxLengthField').value = ''
    document.querySelector('#queuePanel').classList.remove('panel-wrap-out')
  }
}

/**
 * Reset form values and remove CSS class from the queue panel.
 *
 * @param {object} e - Event object
 */
const hideQueue = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#queueIdField').value = ''
  document.querySelector('#queueNameField').value = ''
  document.querySelector('#queueMsgTtlField').value = ''
  document.querySelector('#queueMaxLengthField').value = ''
  document.querySelector('#queuePanel').classList.remove('panel-wrap-out')
}

/**
 * Removes queue from the scene, render and remove CSS class from the queue panel.
 *
 * @param {object} e - Event object
 */
const deleteQueueForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#queueIdField').value
  const actor = window.scene.getIdInScene(id)

  actor.consumers.forEach((consumer) => {
    consumer.removeQueue(actor)
  })
  if (actor && actor.bindings) {
    actor.bindings.forEach((binding) => {
      binding.source.removeBinding(binding)
      window.scene.removeActor(binding)
    })
  }

  window.scene.removeActor(actor)
  window.scene.renderOnce()
  document.querySelector('#queuePanel').classList.remove('panel-wrap-out')
}

/**
 * Display the form to create or edit binding component.
 *
 * @param {Binding} binding - Binding object
 */
const displayBinding = (binding) => {
  document.querySelector('#deleteBindingForm').classList.add('hidden')
  document.querySelector('#bindingPanel').classList.add('panel-wrap-out')

  document.querySelector('#bindingIdField').value = ''
  document.querySelector('#bindingRoutingKeyField').value = ''

  let sourceId = null
  let destinationId = null
  if (binding) {
    document.querySelector('#deleteBindingForm').classList.remove('hidden')
    document.querySelector('#bindingIdField').value = binding.id
    document.querySelector('#bindingRoutingKeyField').value = binding.routingKey
    sourceId = binding.source.id
    destinationId = binding.destination.id
  }

  const exchanges = window.scene.getObjectsInScene('Exchange')
  const queues = window.scene.getObjectsInScene('Queue')

  const selectSource = document.getElementById('bindingSource')
  selectSource.options.length = 0
  Object.keys(exchanges).forEach((exchange) => {
    if (sourceId === exchanges[exchange].id) {
      selectSource.options[selectSource.options.length] = new Option(
        exchanges[exchange].name,
        exchanges[exchange].id,
        false,
        true
      )
    } else {
      selectSource.options[selectSource.options.length] = new Option(
        exchanges[exchange].name,
        exchanges[exchange].id
      )
    }
  })
  const selectDestination = document.getElementById('bindingDestination')
  selectDestination.options.length = 0
  Object.keys(queues).forEach((queue) => {
    if (destinationId === queues[queue].id) {
      selectDestination.options[selectDestination.options.length] = new Option(
        queues[queue].name,
        queues[queue].id,
        false,
        true
      )
    } else {
      selectDestination.options[selectDestination.options.length] = new Option(
        queues[queue].name,
        queues[queue].id
      )
    }
  })
}

/**
 * @param {object} e - Event object
 */
const sendBindingForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#bindingIdField').value
  const routingKey = document.querySelector('#bindingRoutingKeyField').value

  const selectSource = document.getElementById('bindingSource').value
  const selectDestination = document.getElementById('bindingDestination').value

  const ex = window.scene.actors.find((exc) => exc.id === selectSource)
  const qu = window.scene.actors.find((q) => q.id === selectDestination)

  if (id) {
    const binding = window.scene.getIdInScene(id)
    binding.routingKey = routingKey

    binding.source = ex
    binding.destination = qu
    binding.setCoords()
  } else {
    // let e = window.scene.actors.find(e => e.id === selectSource);
    // let q = window.scene.actors.find(q => q.id === selectDestination);
    const Binding1 = new Binding(ex, qu, routingKey)
    Binding1.addToScene(window.scene)
  }

  window.scene.renderOnce()

  document.querySelector('#bindingIdField').value = ''
  document.querySelector('#bindingRoutingKeyField').value = ''
  document.getElementById('bindingSource').value = ''
  document.getElementById('bindingDestination').value = ''
  document.querySelector('#bindingPanel').classList.remove('panel-wrap-out')
}

/**
 * Reset form values and remove CSS class from the binding panel.
 * @param {object} e - Event object
 */
const hideBinding = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#bindingIdField').value = ''
  document.querySelector('#bindingRoutingKeyField').value = ''
  document.getElementById('bindingSource').value = ''
  document.getElementById('bindingDestination').value = ''
  document.querySelector('#bindingPanel').classList.remove('panel-wrap-out')
}

/**
 * @param {object} e - Event object
 */
const deleteBindingForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const id = document.querySelector('#bindingIdField').value
  const actor = window.scene.getIdInScene(id)
  actor.source.removeBinding(actor)
  window.scene.removeActor(actor)
  window.scene.renderOnce()
  document.querySelector('#bindingPanel').classList.remove('panel-wrap-out')
}

/**
 * Display the form to edit settings.
 * @param {Binding} binding - Binding object
 */
const displaySettings = () => {
  document.querySelector('#settingsPanel').classList.add('panel-wrap-out')
  document.querySelector('#settingsErr').innerHTML = ''
  const settings = getSettings()
  if (settings) {
    document.querySelector('#settingsHost').value = settings.host
    document.querySelector('#settingsPort').value = settings.port
    document.querySelector('#settingsManagement').value = settings.management
    document.querySelector('#settingsVHost').value = settings.vhost
    document.querySelector('#settingsUsername').value = settings.username
    document.querySelector('#settingsPassword').value = settings.password
    document.querySelector('#settingsAsyncApiTitle').value =
      settings.asyncapi.title
    document.querySelector('#settingsAsyncApiDescription').value =
      settings.asyncapi.description
  }
}

/**
 * @param {object} e - Event object
 */
const sendSettingsForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const host = document.querySelector('#settingsHost').value
  let error = false
  if (host === '') {
    error = 'Host is required.'
    document.querySelector('#settingsErr').innerHTML = error
  } else {
    setSettings({
      host,
      port: document.querySelector('#settingsPort').value,
      management: document.querySelector('#settingsManagement').value,
      vhost: document.querySelector('#settingsVHost').value,
      username: document.querySelector('#settingsUsername').value,
      password: document.querySelector('#settingsPassword').value,
      asyncapi: {
        title: document.querySelector('#settingsAsyncApiTitle').value,
        description: document.querySelector('#settingsAsyncApiDescription')
          .value
      }
    })
    hideSettings(e)
  }
}

/**
 * Reset form values and remove CSS class from the settings panel.
 * @param {object} e - Event object
 */
const hideSettings = (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.querySelector('#settingsHost').value = ''
  document.querySelector('#settingsPort').value = ''
  document.querySelector('#settingsManagement').value = ''
  document.querySelector('#settingsVHost').value = ''
  document.querySelector('#settingsUsername').value = ''
  document.querySelector('#settingsPassword').value = ''
  document.querySelector('#settingsAsyncApiTitle').value = ''
  document.querySelector('#settingsAsyncApiDescription').value = ''
  document.querySelector('#settingsPanel').classList.remove('panel-wrap-out')
}

export {
  getSettings,
  setSettings,
  changeSettingsTab,
  linepointNearestMouse,
  createTopology,
  displayForm,
  displayProducer,
  sendProducerForm,
  hideProducer,
  deleteProducerForm,
  displayConsumer,
  sendConsumerForm,
  hideConsumer,
  deleteConsumerForm,
  displayExchange,
  sendExchangeForm,
  hideExchange,
  deleteExchangeForm,
  displayQueue,
  sendQueueForm,
  hideQueue,
  deleteQueueForm,
  displayBinding,
  sendBindingForm,
  hideBinding,
  deleteBindingForm,
  displaySettings,
  sendSettingsForm,
  hideSettings
}
