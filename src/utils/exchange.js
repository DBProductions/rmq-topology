import Exchange from '../exchange'

/**
 * Displays the form to create or edit exchange component.
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
 * Resets form values and remove CSS class from the exchange panel.
 *
 * @param {object} e - Event object
 */
const hideExchange = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const settingsParams = ['#exchangeIdField', '#exchangeNameField']
  settingsParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
  document.querySelector('#exchangeTypeSelect').value = 'direct'
  document.querySelector('#exchangePanel').classList.remove('panel-wrap-out')
}

/**
 * Remove exchange from the scene, from the producers and the bindings to the exchange.
 * Renders and removes CSS class from the exchange panel.
 *
 * @param {object} e - Event object
 */
const deleteExchangeForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const exchangeId = document.querySelector('#exchangeIdField').value
  const exchange = window.scene.getIdInScene(exchangeId)
  const producers = window.scene.getObjectsInScene('Producer')
  producers.forEach((producer) => {
    producer.removeExchange(exchange)
  })
  const bindings = window.scene.getObjectsInScene('Binding')
  bindings.forEach((binding) => {
    if (exchangeId === binding.source.id) {
      window.scene.removeActor(binding)
    }
  })
  window.scene.removeActor(window.scene.getIdInScene(exchangeId))
  window.scene.renderOnce()
  document.querySelector('#exchangePanel').classList.remove('panel-wrap-out')
}

export { displayExchange, sendExchangeForm, hideExchange, deleteExchangeForm }
