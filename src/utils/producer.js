import Producer from '../producer'

/**
 * Display the form to create or edit a producer component.
 *
 * @param {Producer} producer - Producer object
 */
const displayProducer = (producer) => {
  document.querySelector('#deleteProducerForm').classList.add('hidden')
  document.querySelector('#producerPanel').classList.add('panel-wrap-out')

  const producerParams = [
    '#producerIdField',
    '#producerNameField',
    '#producerRoutingKeyField'
  ]
  producerParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
  document.querySelector('#producerPublishTo').innerHTML = ''
  document.querySelector('#producerErr').innerHTML = ''

  const exchanges = window.scene.getObjectsInScene('Exchange')

  const selectSource = document.getElementById('producerPublishToSelect')
  selectSource.options.length = 0
  selectSource.options[selectSource.options.length] = new Option(
    '- Exchanges',
    0
  )
  Object.keys(exchanges).forEach((exchange) => {
    selectSource.options[selectSource.options.length] = new Option(
      exchanges[exchange].name,
      exchanges[exchange].id
    )
  })

  if (producer) {
    document.querySelector('#deleteProducerForm').classList.remove('hidden')
    document.querySelector('#producerIdField').value = producer.id
    document.querySelector('#producerNameField').value = producer.name
    let exchangesDom = ''
    for (var key in producer.publishes) {
      exchangesDom += `<div id="${producer.publishes[key].exchange.id}" class="row">`
      exchangesDom += `<input type="hidden" name="producerExchanges[]" value="${producer.publishes[key].exchange.id}" data-routing-key="${producer.publishes[key].routingKey}">`
      exchangesDom += `<div class="flex-left">${producer.publishes[key].exchange.name}<br><small>${producer.publishes[key].routingKey}</small></div>`
      exchangesDom += `<div class="flex-right"><a href="#" data-id="${producer.publishes[key].exchange.id}" class="exchangeDeleteLink">&times;</a></div>`
      exchangesDom += '</div>'
    }
    document.querySelector('#producerPublishTo').innerHTML = exchangesDom
    document.querySelectorAll('.exchangeDeleteLink').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.target.parentNode.parentNode.remove()
        selectSource.options.length = 0
        selectSource.options[selectSource.options.length] = new Option(
          '- Exchanges',
          0
        )
        Object.keys(exchanges).forEach((exchange) => {
          selectSource.options[selectSource.options.length] = new Option(
            exchanges[exchange].name,
            exchanges[exchange].id
          )
        })
      })
    })
  }
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

  const exchange = window.scene.getIdInScene(publishTo)

  const message = {
    headers: {},
    body: {}
  }

  let producer
  let error = false

  if (id) {
    producer = window.scene.getIdInScene(id)

    const exchanges = document.getElementsByName('producerExchanges[]')

    const keepExchanges = {}
    for (const key in producer.publishes) {
      exchanges.forEach((exchange) => {
        if (
          exchange.value === producer.publishes[key].exchange.id &&
          producer.publishes[key].routingKey === exchange.dataset.routingKey
        ) {
          keepExchanges[key] = producer.publishes[key]
        }
      })
    }
    producer.name = name
    producer.publishes = keepExchanges

    if (exchange) {
      if (!producer.exchangeWithRoutingKeyExists(exchange, routingKey)) {
        producer.addMessageToExchange(exchange, routingKey, message)
      } else {
        error = 'Already exists.'
        document.querySelector('#producerErr').innerHTML = error
      }
    }
  } else {
    producer = new Producer(200, 30, name, {})
    if (exchange) {
      if (!producer.exchangeWithRoutingKeyExists(exchange, routingKey)) {
        producer.addMessageToExchange(exchange, routingKey, message)
      } else {
        error = 'Already exists.'
        document.querySelector('#producerErr').innerHTML = error
      }
    }
    producer.addToScene(window.scene)
  }

  window.scene.renderOnce()

  if (!error) {
    const producerParams = [
      '#producerIdField',
      '#producerNameField',
      '#producerRoutingKeyField'
    ]
    producerParams.forEach((p) => {
      document.querySelector(p).value = ''
    })
    document.querySelector('#producerPublishTo').innerHTML = ''
    document.querySelector('#producerErr').innerHTML = ''
    document.querySelector('#producerPanel').classList.remove('panel-wrap-out')
  }
}

/**
 * Reset form values and remove CSS class from the producer panel.
 *
 * @param {object} e - Event object
 */
const hideProducer = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const producerParams = [
    '#producerIdField',
    '#producerNameField',
    '#producerRoutingKeyField'
  ]
  producerParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
  document.querySelector('#producerPublishTo').innerHTML = ''
  document.querySelector('#producerErr').innerHTML = ''
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
  window.scene.removeActor(
    window.scene.getIdInScene(document.querySelector('#producerIdField').value)
  )
  window.scene.renderOnce()
  document.querySelector('#producerPanel').classList.remove('panel-wrap-out')
}

export { displayProducer, sendProducerForm, hideProducer, deleteProducerForm }
