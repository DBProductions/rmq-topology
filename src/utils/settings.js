/**
 * Gets the settings from loacalStorage and parse it as JSON.
 *
 * @returns {object} settings - settings as JSON from localStorage.
 */
const getSettings = () => {
  const data = localStorage.getItem('rmqSettings')
  return JSON.parse(data)
}

/**
 * Sets the current settings in localStorage.
 *
 * @param {object} settings - settings as JSON to set in localStorage.
 */
const setSettings = (settings) => {
  localStorage.setItem('rmqSettings', JSON.stringify(settings))
}

/**
 * Hide and show tab links and the content for it.
 *
 * @param {Object} Event
 */
const changeSettingsTab = (e) => {
  e.preventDefault()
  try {
    const link = document.querySelector(`#settingsTabHref${e.target.innerHTML}`)
    if (link) {
      const tabLinks = document.querySelector('#settingsTabs')
      const liList = tabLinks.getElementsByTagName('li')
      for (const i in liList) {
        if (liList[i].classList) {
          liList[i].classList.remove('selected')
        }
      }

      const tabContent = document.querySelectorAll('#tabContainer > div')
      for (const d in tabContent) {
        if (tabContent[d].classList) {
          tabContent[d].classList.add('tab-hidden')
        }
      }

      link.classList.add('selected')
      document
        .querySelector(`#settingsTab${e.target.innerHTML}`)
        .classList.remove('tab-hidden')
    }
  } catch (err) {
    return
  }
}

/**
 * Display the form to edit settings.
 *
 * @param {Binding} binding - Binding object
 */
const displaySettings = () => {
  document.querySelector('#settingsPanel').classList.add('panel-wrap-out')
  document.querySelector('#settingsErr').innerHTML = ''
  const settings = getSettings()
  if (settings) {
    document.querySelector('#settingsHost').value = settings.host
    document.querySelector('#settingsPort').value = settings.port
    document.querySelector('#settingsManagement').value = settings.management
    document.querySelector('#settingsVHost').value = settings.vhost
    document.querySelector('#settingsUsername').value = settings.username
    document.querySelector('#settingsPassword').value = settings.password
    document.querySelector('#settingsAsyncApiTitle').value =
      settings.asyncapi.title
    document.querySelector('#settingsAsyncApiDescription').value =
      settings.asyncapi.description
    document.querySelector('#settingsAsyncApiVersion').value =
      settings.asyncapi.version
  }
}

/**
 * Sends the form to set settings.
 *
 * @param {object} e - Event object
 */
const sendSettingsForm = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const host = document.querySelector('#settingsHost').value
  let error = false
  if (host === '') {
    error = 'Host is required.'
    document.querySelector('#settingsErr').innerHTML = error
  } else {
    setSettings({
      host,
      port: document.querySelector('#settingsPort').value,
      management: document.querySelector('#settingsManagement').value,
      vhost: document.querySelector('#settingsVHost').value,
      username: document.querySelector('#settingsUsername').value,
      password: document.querySelector('#settingsPassword').value,
      asyncapi: {
        title: document.querySelector('#settingsAsyncApiTitle').value,
        description: document.querySelector('#settingsAsyncApiDescription')
          .value,
        version: document.querySelector('#settingsAsyncApiVersion').value
      }
    })
    hideSettings(e)
  }
}

/**
 * Reset form values and remove CSS class from the settings panel.
 *
 * @param {object} e - Event object
 */
const hideSettings = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const settingsParams = [
    '#settingsHost',
    '#settingsPort',
    '#settingsManagement',
    '#settingsVHost',
    '#settingsUsername',
    '#settingsPassword',
    '#settingsAsyncApiTitle',
    '#settingsAsyncApiDescription',
    '#settingsAsyncApiVersion'
  ]
  settingsParams.forEach((p) => {
    document.querySelector(p).value = ''
  })
  document.querySelector('#settingsPanel').classList.remove('panel-wrap-out')
}

export {
  getSettings,
  setSettings,
  changeSettingsTab,
  displaySettings,
  sendSettingsForm,
  hideSettings
}
