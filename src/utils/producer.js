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

  const customMsgToggle = document.querySelector('#producerCustomMsgToggle')
  const customMsgSection = document.querySelector('#producerCustomMsgSection')
  if (customMsgToggle) {
    customMsgToggle.checked = false
    customMsgToggle.onchange = () => {
      if (customMsgToggle.checked) {
        customMsgSection.classList.remove('hidden')
      } else {
        customMsgSection.classList.add('hidden')
      }
    }
  }
  if (customMsgSection) {
    customMsgSection.classList.add('hidden')
  }
  const headersInput = document.querySelector('#producerMsgHeaders')
  const bodyInput = document.querySelector('#producerMsgBody')
  if (headersInput) {
    headersInput.value = ''
  }
  if (bodyInput) {
    bodyInput.value = ''
  }

  const exchanges = globalThis.scene.getObjectsInScene('Exchange')

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
      exchangesDom += `<div id="${
        producer.publishes[key].exchange.id
      }" class="row">`
      exchangesDom += `<input type="hidden" name="producerExchanges[]" value="${
        producer.publishes[key].exchange.id
      }" data-routing-key="${producer.publishes[key].routingKey}">`
      exchangesDom += `<div class="flex-left">${
        producer.publishes[key].exchange.name
      }<br><small>${producer.publishes[key].routingKey}</small></div>`
      exchangesDom += `<div class="flex-right"><a href="#" data-id="${
        producer.publishes[key].exchange.id
      }" class="exchangeDeleteLink">&times;</a></div>`
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

const cloneMessage = (msg) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(msg)
  }
  try {
    return JSON.parse(JSON.stringify(msg))
  } catch (err) {
    return { headers: {}, body: {} }
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

  const exchange = globalThis.scene.getIdInScene(publishTo)

  const errEl = document.querySelector('#producerErr')
  if (errEl) {
    errEl.innerHTML = ''
  }

  let message = {
    headers: {},
    body: {}
  }

  const useCustomMsg = document.querySelector('#producerCustomMsgToggle')
  if (useCustomMsg && useCustomMsg.checked) {
    const headersInput = document.querySelector('#producerMsgHeaders')
    const bodyInput = document.querySelector('#producerMsgBody')
    const headersStr = headersInput ? headersInput.value.trim() : ''
    const bodyStr = bodyInput ? bodyInput.value.trim() : ''

    let parsedHeaders = {}
    if (headersStr !== '') {
      try {
        parsedHeaders = JSON.parse(headersStr)
        if (
          typeof parsedHeaders !== 'object' ||
          parsedHeaders === null ||
          Array.isArray(parsedHeaders)
        ) {
          if (errEl) {
            errEl.innerHTML = 'Headers must be a JSON object.'
          }
          return
        }
      } catch (err) {
        if (errEl) {
          errEl.innerHTML = 'Headers must be valid JSON.'
        }
        return
      }
    }

    let parsedBody = {}
    if (bodyStr !== '') {
      try {
        parsedBody = JSON.parse(bodyStr)
      } catch (err) {
        if (errEl) {
          errEl.innerHTML = 'Body must be valid JSON.'
        }
        return
      }
    }

    message = {
      headers: parsedHeaders,
      body: parsedBody
    }
  }

  let producer
  let error = false

  if (id) {
    producer = globalThis.scene.getIdInScene(id)

    const exchanges = document.getElementsByName('producerExchanges[]')

    const keepExchanges = {}
    for (const key in producer.publishes) {
      exchanges.forEach((exchangeEl) => {
        if (
          exchangeEl.value === producer.publishes[key].exchange.id &&
          producer.publishes[key].routingKey === exchangeEl.dataset.routingKey
        ) {
          keepExchanges[key] = producer.publishes[key]
        }
      })
    }
    producer.name = name
    producer.publishes = keepExchanges

    if (useCustomMsg && useCustomMsg.checked) {
      // The custom message is producer-level, so it replaces the message of
      // every publish that is kept on this producer.
      for (const key in producer.publishes) {
        producer.publishes[key].message = cloneMessage(message)
      }
    }

    if (exchange) {
      if (!producer.exchangeWithRoutingKeyExists(exchange, routingKey)) {
        producer.addMessageToExchange(exchange, routingKey, message)
      } else if (!(useCustomMsg && useCustomMsg.checked)) {
        error = 'Already exists.'
        if (errEl) {
          errEl.innerHTML = error
        }
      }
    }
  } else {
    producer = new Producer(200, 30, name, {})
    if (exchange) {
      if (!producer.exchangeWithRoutingKeyExists(exchange, routingKey)) {
        producer.addMessageToExchange(exchange, routingKey, message)
      } else {
        error = 'Already exists.'
        if (errEl) {
          errEl.innerHTML = error
        }
      }
    }
    producer.addToScene(globalThis.scene)
  }

  globalThis.scene.render()

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
    if (errEl) {
      errEl.innerHTML = ''
    }
    if (useCustomMsg) {
      useCustomMsg.checked = false
    }
    const customMsgSection = document.querySelector('#producerCustomMsgSection')
    if (customMsgSection) {
      customMsgSection.classList.add('hidden')
    }
    const headersInput = document.querySelector('#producerMsgHeaders')
    const bodyInput = document.querySelector('#producerMsgBody')
    if (headersInput) {
      headersInput.value = ''
    }
    if (bodyInput) {
      bodyInput.value = ''
    }
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
  globalThis.scene.removeActor(
    globalThis.scene.getIdInScene(
      document.querySelector('#producerIdField').value
    )
  )
  globalThis.scene.render()
  document.querySelector('#producerPanel').classList.remove('panel-wrap-out')
}

export { deleteProducerForm, displayProducer, hideProducer, sendProducerForm }
