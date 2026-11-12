const inlineWrapId = 'consumerMsgInlineWrap'
const inlineId = 'consumerMsgInline'
const toggleId = 'consumerShowMessagesToggle'
const idFieldId = 'consumerIdField'

const getScene = () => {
  if (typeof globalThis !== 'undefined' && globalThis.scene) {
    return globalThis.scene
  }
  return null
}

const getCurrentConsumer = () => {
  const idField = document.getElementById(idFieldId)
  if (!idField || !idField.value) {
    return null
  }
  const scene = getScene()
  return scene && scene.getIdInScene ? scene.getIdInScene(idField.value) : null
}

const formatLog = (log) => {
  let out = ''
  for (let i = log.length - 1; i >= 0; i -= 1) {
    const entry = log[i]
    const ts = entry.ts ? new Date(entry.ts).toLocaleTimeString() : ''
    const route = []
    if (entry.exchange) {
      route.push(`exchange ${entry.exchange}`)
    }
    if (entry.routingKey) {
      route.push(`rk ${entry.routingKey}`)
    }
    if (entry.queue) {
      route.push(`queue ${entry.queue}`)
    }
    out += `[${ts}]${route.length ? ' ' + route.join(' · ') : ''}\n`
    try {
      out += JSON.stringify(entry.message, null, 2) + '\n\n'
    } catch (e) {
      out += String(entry.message) + '\n\n'
    }
  }
  return out
}

const render = () => {
  const wrap = document.getElementById(inlineWrapId)
  const area = document.getElementById(inlineId)
  const toggle = document.getElementById(toggleId)
  if (!wrap || !area) {
    return
  }
  if (!toggle || !toggle.checked) {
    wrap.style.display = 'none'
    return
  }
  wrap.style.display = 'block'
  const consumer = getCurrentConsumer()
  if (!consumer) {
    area.value = 'Save the consumer to start displaying messages.'
    return
  }
  const log = consumer.messageLog || []
  area.value = log.length ? formatLog(log) : 'Waiting for messages...'
}

const init = () => {
  const toggle = document.getElementById(toggleId)
  if (toggle) {
    toggle.addEventListener('change', () => {
      const consumer = getCurrentConsumer()
      if (consumer) {
        consumer.displayMessages = toggle.checked
        if (toggle.checked && !consumer.messageLog) {
          consumer.messageLog = []
        }
      }
      render()
    })
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.updateConsumerMessageDisplay = () => {
      render()
    }
  }

  setInterval(render, 250)
  render()
}

if (typeof document !== 'undefined') {
  const start = () => {
    try {
      init()
    } catch (e) {
      console.error('consumerDisplay init error', e)
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
}

export { init, render }
