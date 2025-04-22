import Queue from '../queue'

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

  const selectType = document.querySelector('#queueTypeField')
  selectType.options.length = 0
  selectType.options[selectType.options.length] = new Option('quorum', 'quorum')
  selectType.options[selectType.options.length] = new Option('stream', 'stream')

  let dlx = { id: null }
  //let dlxrk = ''
  if (queue) {
    document.querySelector('#deleteQueueForm').classList.remove('hidden')
    document.querySelector('#queueIdField').value = queue.id
    document.querySelector('#queueNameField').value = queue.name
    document.querySelector('#queueTypeField').value = queue.type
    document.querySelector('#queueMsgTtlField').value = queue.msgTtl
    document.querySelector('#queueMaxLengthField').value = queue.maxLength
    if (queue.dlx) {
      dlx = queue.dlx
      //dlxrk = queue.dlxrk
      document.querySelector('#queueDlRoutingKey').value = queue.dlxrk
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
  const type = document.querySelector('#queueTypeField').value
  const msgTtl = document.querySelector('#queueMsgTtlField').value
  const dlx = document.querySelector('#queueDlxSelect').value
  const dlxrk = document.querySelector('#queueDlRoutingKey').value
  const maxLength = document.querySelector('#queueMaxLengthField').value
  let error = false

  if (name === '') {
    error = 'Name is required.'
    document.querySelector('#queueErr').innerHTML = error
  } else if (id) {
    const queue = window.scene.getIdInScene(id)
    queue.name = name
    queue.type = type
    queue.msgTtl = msgTtl
    queue.maxLength = maxLength
    queue.dlx = window.scene.getIdInScene(dlx)
    queue.dlxrk = dlxrk
  } else {
    const queues = window.scene.getObjectsInScene('Queue')
    const queueIndex = queues.findIndex((q) => q.name === name)
    if (queueIndex === -1) {
      const Queue1 = new Queue(650, 30, name, type)
      Queue1.addToScene(window.scene)
      Queue1.msgTtl = msgTtl
      Queue1.dlx = window.scene.getIdInScene(dlx)
      Queue1.dlxrk = dlxrk
    } else {
      error = `Queue with name '${name}' already exists.`
      document.querySelector('#queueErr').innerHTML = error
    }
  }

  window.scene.render()

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
  const settingsParams = [
    '#queueIdField',
    '#queueNameField',
    '#queueMsgTtlField',
    '#queueMaxLengthField'
  ]
  settingsParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
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
  const actor = window.scene.getIdInScene(
    document.querySelector('#queueIdField').value
  )
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
  window.scene.render()
  document.querySelector('#queuePanel').classList.remove('panel-wrap-out')
}

export { displayQueue, sendQueueForm, hideQueue, deleteQueueForm }
