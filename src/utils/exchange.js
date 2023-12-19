import Exchange from '../exchange'

/**
 * Displays the form to create or edit exchange component.
 *
 * @param {Exchange} exchange - Exchange object
 */
const displayExchange = (exchange) => {
  document.querySelector('#deleteExchangeForm').classList.add('hidden')
  document.querySelector('#exchangePanel').classList.add('panel-wrap-out')

  const exchangeParams = [
    '#exchangeErr',
    '#exchangeIdField',
    '#exchangeNameField',
    '#exchangeAlternateSelect'
  ]
  exchangeParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
  document.querySelector('#exchangeTypeSelect').value = 'direct'

  const selectSource = document.getElementById('exchangeAlternateSelect')
  selectSource.options.length = 0
  selectSource.options[selectSource.options.length] = new Option(
    '- Alternate Exchange',
    0
  )
  const exchanges = window.scene.getObjectsInScene('Exchange')

  if (exchange) {
    Object.keys(exchanges).forEach((ex) => {
      if (exchange.id !== exchanges[ex].id) {
        let defaultSelected = false
        let selected = false
        if (exchange.alternate && exchanges[ex].id === exchange.alternate.id) {
          defaultSelected = true
          selected = true
        }
        selectSource.options[selectSource.options.length] = new Option(
          exchanges[ex].name,
          exchanges[ex].id,
          defaultSelected,
          selected
        )
      }
    })
    document.querySelector('#deleteExchangeForm').classList.remove('hidden')
    document.querySelector('#exchangeIdField').value = exchange.id
    document.querySelector('#exchangeNameField').value = exchange.name
    document.querySelector('#exchangeTypeSelect').value = exchange.type
  } else {
    Object.keys(exchanges).forEach((ex) => {
      selectSource.options[selectSource.options.length] = new Option(
        exchanges[ex].name,
        exchanges[ex].id
      )
    })
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
  const alternate = document.querySelector('#exchangeAlternateSelect').value
  let error = false

  if (name === '') {
    error = 'Name is required.'
    document.querySelector('#exchangeErr').innerHTML = error
  } else if (id) {
    const exchanges = window.scene.getObjectsInScene('Exchange')
    const exchangeIdIndex = exchanges.findIndex((e) => e.id === id)
    const exchangeIndex = exchanges.findIndex((e) => e.name === name)
    if (exchangeIndex === -1 || exchangeIdIndex !== -1) {
      const exchange = window.scene.getIdInScene(id)
      const alternateExchange = window.scene.getIdInScene(alternate)
      exchange.name = name
      exchange.type = type
      exchange.alternate = alternateExchange
    } else {
      error = `Exchange with name '${name}' already exists.`
      document.querySelector('#exchangeErr').innerHTML = error
    }
  } else {
    const exchanges = window.scene.getObjectsInScene('Exchange')
    const exchangeIndex = exchanges.findIndex((e) => e.name === name)
    if (exchangeIndex === -1) {
      const alternateExchange = window.scene.getIdInScene(alternate)
      const Exchange1 = new Exchange(400, 30, name, type, alternateExchange)
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
  const exchangeParams = ['#exchangeIdField', '#exchangeNameField']
  exchangeParams.forEach((p) => {
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
