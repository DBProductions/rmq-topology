import Binding from '../binding'
import Exchange from '../exchange'

/**
 * Populates the destination select with either exchanges or queues, based on
 * the selected destination type. Preserves the current selection when the id
 * is still present in the new list.
 *
 * @param {string} selectedId - id to preselect, if present
 */
const populateBindingDestination = (selectedId) => {
  const destinationType = document.querySelector(
    '#bindingDestinationType'
  ).value
  const actors = globalThis.scene.getObjectsInScene(
    destinationType === 'exchange' ? 'Exchange' : 'Queue'
  )
  const selectDestination = document.getElementById('bindingDestination')
  selectDestination.options.length = 0
  Object.keys(actors).forEach((key) => {
    const actor = actors[key]
    if (selectedId === actor.id) {
      selectDestination.options[selectDestination.options.length] = new Option(
        actor.name,
        actor.id,
        false,
        true
      )
    } else {
      selectDestination.options[selectDestination.options.length] = new Option(
        actor.name,
        actor.id
      )
    }
  })
}

/**
 * Changes the destination type of the binding form.
 * Re-populates the destination select with exchanges or queues.
 */
const changeBindingDestinationType = () => {
  const currentId = document.getElementById('bindingDestination').value
  document.querySelector('#bindingErr').innerHTML = ''
  populateBindingDestination(currentId || undefined)
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
  document.querySelector('#bindingErr').innerHTML = ''

  let sourceId = null
  let destinationId = null
  let destinationType = 'queue'
  if (binding) {
    document.querySelector('#deleteBindingForm').classList.remove('hidden')
    document.querySelector('#bindingIdField').value = binding.id
    document.querySelector('#bindingRoutingKeyField').value = binding.routingKey
    sourceId = binding.source.id
    destinationId = binding.destination.id
    if (binding.destination instanceof Exchange) {
      destinationType = 'exchange'
    }
  }
  document.querySelector('#bindingDestinationType').value = destinationType

  const exchanges = globalThis.scene.getObjectsInScene('Exchange')

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
  populateBindingDestination(destinationId)
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

  const ex = globalThis.scene.actors.find((exc) => exc.id === selectSource)
  const dest = globalThis.scene.actors.find((q) => q.id === selectDestination)

  if (!ex || !dest) {
    document.querySelector('#bindingErr').innerHTML =
      'Please select source and destination.'
    return
  }
  if (ex.id === dest.id) {
    document.querySelector('#bindingErr').innerHTML =
      'Source and destination must be different.'
    return
  }

  if (id) {
    const binding = globalThis.scene.getIdInScene(id)
    binding.routingKey = routingKey

    binding.source = ex
    binding.destination = dest
    binding.setCoords()
  } else {
    // let e = window.scene.actors.find(e => e.id === selectSource);
    // let q = window.scene.actors.find(q => q.id === selectDestination);
    const Binding1 = new Binding(ex, dest, routingKey)
    Binding1.addToScene(globalThis.scene)
  }

  globalThis.scene.render()

  document.querySelector('#bindingIdField').value = ''
  document.querySelector('#bindingRoutingKeyField').value = ''
  document.getElementById('bindingSource').value = ''
  document.getElementById('bindingDestination').value = ''
  document.querySelector('#bindingDestinationType').value = 'queue'
  document.querySelector('#bindingErr').innerHTML = ''
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
  document.querySelector('#bindingDestinationType').value = 'queue'
  document.querySelector('#bindingErr').innerHTML = ''
  document.querySelector('#bindingPanel').classList.remove('panel-wrap-out')
}

/**
 * Removes a binding.
 *
 * @param {object} e - Event object
 */
const deleteBindingForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const actor = globalThis.scene.getIdInScene(
    document.querySelector('#bindingIdField').value
  )
  actor.source.removeBinding(actor)
  if (actor.destination instanceof Exchange) {
    actor.destination.removeBinding(actor)
  }
  globalThis.scene.removeActor(actor)
  globalThis.scene.render()
  document.querySelector('#bindingPanel').classList.remove('panel-wrap-out')
}

export {
  changeBindingDestinationType,
  deleteBindingForm,
  displayBinding,
  hideBinding,
  sendBindingForm
}
