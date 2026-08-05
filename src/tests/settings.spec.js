import {
  brokerDefaultSettings,
  getSettings,
  setSettings
} from '../utils/settings'

describe('brokerDefaultSettings', () => {
  it('should have the correct default values', () => {
    expect(brokerDefaultSettings.host).toEqual('localhost')
    expect(brokerDefaultSettings.port).toEqual(5672)
    expect(brokerDefaultSettings.management).toEqual(
      'http://localhost:15672/api'
    )
    expect(brokerDefaultSettings.vhost).toEqual('%2f')
    expect(brokerDefaultSettings.username).toEqual('guest')
    expect(brokerDefaultSettings.password).toEqual('guest')
  })

  it('should have asyncapi config', () => {
    expect(brokerDefaultSettings.asyncapi).toBeDefined()
    expect(brokerDefaultSettings.asyncapi.title).toEqual('RabbitMQ')
    expect(brokerDefaultSettings.asyncapi.description).toEqual(
      'Broker description.'
    )
    expect(brokerDefaultSettings.asyncapi.version).toEqual('0.0.1')
  })
})

describe('getSettings / setSettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return null when no settings exist', () => {
    expect(getSettings()).toBeNull()
  })

  it('should store and retrieve settings', () => {
    setSettings(brokerDefaultSettings)
    const settings = getSettings()
    expect(settings).toEqual(brokerDefaultSettings)
  })

  it('should update settings', () => {
    setSettings(brokerDefaultSettings)
    const updated = { ...brokerDefaultSettings, host: 'rabbitmq.example.com' }
    setSettings(updated)
    const settings = getSettings()
    expect(settings.host).toEqual('rabbitmq.example.com')
  })

  it('should return null when localStorage contains invalid JSON', () => {
    localStorage.setItem('rmqSettings', 'not-valid-json{{{')
    expect(getSettings()).toBeNull()
  })

  it('should return the stored settings object by reference', () => {
    const custom = { ...brokerDefaultSettings, port: 5673 }
    setSettings(custom)
    const result = getSettings()
    expect(result.port).toEqual(5673)
    expect(result.vhost).toEqual('%2f')
  })
})
