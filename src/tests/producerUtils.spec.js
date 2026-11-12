import {
  formatMessagePreview,
  hasCustomMessage,
  messagesMatch,
  stripAutoHeaders
} from '../utils/producer'

describe('producer message helpers', () => {
  it('strips auto-generated headers', () => {
    expect(
      stripAutoHeaders({
        'app-id': 'Producer',
        'message-id': 'abc',
        'content-type': 'application/json'
      })
    ).toEqual({ 'content-type': 'application/json' })
  })

  it('handles missing headers', () => {
    expect(stripAutoHeaders(undefined)).toEqual({})
    expect(stripAutoHeaders(null)).toEqual({})
  })

  it('detects custom messages', () => {
    expect(hasCustomMessage({ headers: {}, body: {} })).toBe(false)
    expect(hasCustomMessage(undefined)).toBe(false)
    expect(
      hasCustomMessage({
        headers: { 'app-id': 'Producer', 'message-id': 'abc' },
        body: {}
      })
    ).toBe(false)
    expect(hasCustomMessage({ headers: { custom: 'header' }, body: {} })).toBe(
      true
    )
    expect(hasCustomMessage({ headers: {}, body: { hello: 'world' } })).toBe(
      true
    )
  })

  it('compares messages ignoring auto headers and key order', () => {
    expect(
      messagesMatch(
        { headers: { 'app-id': 'Producer' }, body: { a: 1, b: 2 } },
        { headers: {}, body: { b: 2, a: 1 } }
      )
    ).toBe(true)
    expect(
      messagesMatch({ headers: {}, body: { a: 1 } }, { headers: {}, body: {} })
    ).toBe(false)
  })

  it('formats a default message preview', () => {
    expect(formatMessagePreview({ headers: {}, body: {} })).toBe(
      'default message'
    )
    expect(
      formatMessagePreview({
        headers: { 'app-id': 'Producer', 'message-id': 'abc' },
        body: {}
      })
    ).toBe('default message')
  })

  it('formats a custom message preview', () => {
    const preview = formatMessagePreview({
      headers: { custom: 'header' },
      body: { hello: 'world' }
    })
    expect(preview).toContain('headers {"custom":"header"}')
    expect(preview).toContain('body {"hello":"world"}')
  })

  it('truncates long previews', () => {
    const preview = formatMessagePreview({
      headers: {},
      body: { long: 'x'.repeat(200) }
    })
    expect(preview.length).toBeLessThanOrEqual(90)
    expect(preview.endsWith('...')).toBe(true)
  })
})
