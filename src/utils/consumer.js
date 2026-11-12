import Consumer from '../consumer'

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
  const displayToggle = document.querySelector('#consumerShowMessagesToggle')
  if (displayToggle) {
    displayToggle.checked = false
  }

  const queues = globalThis.scene.getObjectsInScene('Queue')
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
        val.checked = true
      }
    })

    const displayToggle = document.querySelector('#consumerShowMessagesToggle')
    if (displayToggle) {
      displayToggle.checked = !!consumer.displayMessages
    }

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
  const settingsParams = ['#consumerIdField', '#consumerNameField']
  settingsParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
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

  const displayToggle = document.querySelector('#consumerShowMessagesToggle')
  const showMessages = displayToggle ? displayToggle.checked : false

  let consumer

  if (id) {
    consumer = globalThis.scene.getIdInScene(id)

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
      const actor = globalThis.scene.getIdInScene(rmQueue.id)
      actor.removeConsumer(consumer)
    })

    consumer.name = name
    consumer.mode = mode || consumer.mode || 'ack'
    consumer.queues = restQueues
    consumer.displayMessages = showMessages
    if (showMessages && !consumer.messageLog) {
      consumer.messageLog = []
    }

    if (consumesFrom !== '0') {
      consumer.addQueue(globalThis.scene.getIdInScene(consumesFrom))
    }
  } else {
    consumer = new Consumer(800, 30, name, [], mode || 'ack')
    consumer.displayMessages = showMessages
    if (showMessages) {
      consumer.messageLog = []
    }
    consumer.addToScene(globalThis.scene)
    if (consumesFrom !== '0') {
      consumer.addQueue(globalThis.scene.getIdInScene(consumesFrom))
    }
  }

  if (typeof globalThis.updateConsumerMessageDisplay === 'function') {
    globalThis.updateConsumerMessageDisplay(consumer)
  }

  globalThis.scene.render()

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
  const consumer = globalThis.scene.getIdInScene(
    document.querySelector('#consumerIdField').value
  )
  consumer.queues.forEach((rmQueue) => {
    const actor = globalThis.scene.getIdInScene(rmQueue.id)
    actor.removeConsumer(consumer)
  })
  globalThis.scene.removeActor(consumer)
  globalThis.scene.render()
  document.querySelector('#consumerPanel').classList.remove('panel-wrap-out')
}

export { deleteConsumerForm, displayConsumer, hideConsumer, sendConsumerForm }
