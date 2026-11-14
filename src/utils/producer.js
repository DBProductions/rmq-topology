import Producer from '../producer'

const AUTO_HEADERS = ['app-id', 'message-id']

/**
 * Removes the headers that the producer generates on every publish.
 *
 * @param {Object} headers - message headers
 * @returns {Object} headers without the auto-generated values
 */
const stripAutoHeaders = (headers) => {
  const out = {}
  if (!headers || typeof headers !== 'object') {
    return out
  }
  Object.keys(headers).forEach((key) => {
    if (!AUTO_HEADERS.includes(key)) {
      out[key] = headers[key]
    }
  })
  return out
}

/**
 * Checks whether a message body is empty.
 *
 * @param {*} body - message body
 * @returns {boolean}
 */
const isEmptyBody = (body) =>
  body === undefined ||
  body === null ||
  (typeof body === 'object' &&
    !Array.isArray(body) &&
    Object.keys(body).length === 0)

/**
 * Normalizes a message so auto-generated headers are ignored.
 *
 * @param {Object} message - message with headers and body
 * @returns {{headers: Object, body: *}}
 */
const normalizeMessage = (message) => {
  const body = message && message.body
  return {
    headers: stripAutoHeaders(message && message.headers),
    body: body === undefined || body === null ? {} : body
  }
}

const stableStringify = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

/**
 * Checks whether a message contains custom headers or a non-empty body.
 *
 * @param {Object} message - message with headers and body
 * @returns {boolean}
 */
const hasCustomMessage = (message) => {
  const normalized = normalizeMessage(message)
  return (
    Object.keys(normalized.headers).length > 0 || !isEmptyBody(normalized.body)
  )
}

/**
 * Compares two messages ignoring auto-generated headers.
 *
 * @param {Object} a - first message
 * @param {Object} b - second message
 * @returns {boolean}
 */
const messagesMatch = (a, b) =>
  stableStringify(normalizeMessage(a)) === stableStringify(normalizeMessage(b))

/**
 * Builds the short message preview shown in the publish list.
 *
 * @param {Object} message - message with headers and body
 * @returns {string}
 */
const formatMessagePreview = (message) => {
  const normalized = normalizeMessage(message)
  if (
    Object.keys(normalized.headers).length === 0 &&
    isEmptyBody(normalized.body)
  ) {
    return 'default message'
  }
  const preview = `headers ${JSON.stringify(
    normalized.headers
  )} · body ${JSON.stringify(normalized.body)}`
  return preview.length > 90 ? `${preview.slice(0, 87)}...` : preview
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

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
  const msgNote = document.querySelector('#producerMsgNote')
  const headersInput = document.querySelector('#producerMsgHeaders')
  const bodyInput = document.querySelector('#producerMsgBody')

  if (customMsgToggle) {
    customMsgToggle.checked = false
    customMsgToggle.onchange = () => {
      if (customMsgSection) {
        customMsgSection.classList.toggle('is-hidden', !customMsgToggle.checked)
      }
    }
  }
  if (customMsgSection) {
    customMsgSection.classList.add('is-hidden')
  }
  if (msgNote) {
    msgNote.classList.add('is-hidden')
    msgNote.textContent = ''
  }
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

    const publishList = Object.values(producer.publishes)
    const firstCustom = publishList.find((publish) =>
      hasCustomMessage(publish.message)
    )
    if (firstCustom) {
      if (customMsgToggle) {
        customMsgToggle.checked = true
      }
      if (customMsgSection) {
        customMsgSection.classList.remove('is-hidden')
      }
      if (headersInput) {
        headersInput.value = JSON.stringify(
          stripAutoHeaders(firstCustom.message && firstCustom.message.headers),
          null,
          2
        )
      }
      if (bodyInput) {
        const body = firstCustom.message && firstCustom.message.body
        bodyInput.value = JSON.stringify(
          body === undefined || body === null ? {} : body,
          null,
          2
        )
      }
      const mixed = publishList.some(
        (publish) => !messagesMatch(publish.message, firstCustom.message)
      )
      if (mixed && msgNote) {
        msgNote.textContent =
          'This producer has multiple publish targets with different messages. Saving applies this message to all of them.'
        msgNote.classList.remove('is-hidden')
      }
    }

    let exchangesDom = ''
    for (var key in producer.publishes) {
      const preview = escapeHtml(
        formatMessagePreview(producer.publishes[key].message)
      )
      exchangesDom += `<div id="${
        producer.publishes[key].exchange.id
      }" class="row">`
      exchangesDom += `<input type="hidden" name="producerExchanges[]" value="${
        producer.publishes[key].exchange.id
      }" data-routing-key="${producer.publishes[key].routingKey}">`
      exchangesDom += `<div class="flex-left">${
        producer.publishes[key].exchange.name
      }<br><small>${
        producer.publishes[key].routingKey
      }</small><br><small class="msg-preview">${preview}</small></div>`
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

  const customMsgToggle = document.querySelector('#producerCustomMsgToggle')
  const customEnabled = !!(customMsgToggle && customMsgToggle.checked)
  if (customEnabled) {
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

    if (customMsgToggle) {
      // The custom message is producer-level: apply it to every kept publish,
      // or reset every kept publish to the default message when unchecked.
      for (const key in producer.publishes) {
        producer.publishes[key].message = customEnabled
          ? cloneMessage(message)
          : { headers: {}, body: {} }
      }
    }

    if (
      exchange &&
      !producer.exchangeWithRoutingKeyExists(exchange, routingKey)
    ) {
      producer.addMessageToExchange(exchange, routingKey, message)
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
    if (customMsgToggle) {
      customMsgToggle.checked = false
    }
    const customMsgSection = document.querySelector('#producerCustomMsgSection')
    if (customMsgSection) {
      customMsgSection.classList.add('is-hidden')
    }
    const msgNote = document.querySelector('#producerMsgNote')
    if (msgNote) {
      msgNote.classList.add('is-hidden')
      msgNote.textContent = ''
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

export {
  deleteProducerForm,
  displayProducer,
  formatMessagePreview,
  hasCustomMessage,
  hideProducer,
  messagesMatch,
  sendProducerForm,
  stripAutoHeaders
}
