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
  const consumer = window.scene.getIdInScene(
    document.querySelector('#consumerIdField').value
  )
  consumer.queues.forEach((rmQueue) => {
    const actor = window.scene.getIdInScene(rmQueue.id)
    actor.removeConsumer(consumer)
  })
  window.scene.removeActor(consumer)
  window.scene.renderOnce()
  document.querySelector('#consumerPanel').classList.remove('panel-wrap-out')
}

export { displayConsumer, sendConsumerForm, hideConsumer, deleteConsumerForm }
