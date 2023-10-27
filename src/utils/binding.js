import Binding from '../binding'

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
 * Sends the form to create or edit an binding component.
 *
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
 *
 * @param {object} e - Event object
 */
const hideBinding = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const settingsParams = [
    '#bindingIdField',
    '#bindingRoutingKeyField',
    '#bindingSource',
    '#bindingDestination'
  ]
  settingsParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
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

export { displayBinding, sendBindingForm, hideBinding, deleteBindingForm }
