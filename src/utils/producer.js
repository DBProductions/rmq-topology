import Producer from '../producer'

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
        refreshPublishToSelect(producer, exchanges)
      })
    })
  }
}

/**
 * Refreshs the `producerPublishToSelect` element.
 *
 * @param {Producer} producer - Producer object
 * @param {Exchange} exchange - Exchange object
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
  const settingsParams = [
    '#producerIdField',
    '#producerNameField',
    '#producerRoutingKeyField'
  ]
  settingsParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
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

export { displayProducer, sendProducerForm, hideProducer, deleteProducerForm }
