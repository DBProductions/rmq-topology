describe('UI Component', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Start Stop Timer', () => {
    cy.get('#animate')
      .invoke('text')
      .then((t) => expect(t.trim()).to.equal('Start'))
    cy.get('#animate').click()
    cy.window().its('timer.running').should('equal', true)
    cy.get('#animate')
      .invoke('text')
      .then((t) => expect(t.trim()).to.equal('Stop'))
    cy.get('#animate').click()
    cy.window().its('timer.running').should('equal', false)
    cy.get('#animate')
      .invoke('text')
      .then((t) => expect(t.trim()).to.equal('Start'))
  })

  it('Export and copy definition', () => {
    cy.get('#export').click()
    cy.get('#imexportPanel').should('be.visible')
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[],"consumers":[],"exchanges":[],"queues":[],"bindings":[]}'
    )
    // copy
    cy.get('#copyBtn').click()
    cy.assertValueCopiedToClipboard(
      '{"description":"","producers":[],"consumers":[],"exchanges":[],"queues":[],"bindings":[]}'
    )
  })

  it('Import definition', () => {
    cy.get('#export').click()
    cy.get('#imexportPanel').should('be.visible')
    cy.get('#ImExport').type(
      '{{}"description":"","producers":[],"consumers":[],"exchanges":[],"queues":[],"bindings":[]}'
    )
    cy.get('#importBtn').click()
    cy.window().its('scene.actors.length').should('equal', 0)

    cy.get('#export').click()
    cy.get('#imexportPanel').should('be.visible')
    cy.get('#ImExport').clear()
    cy.get('#ImExport').type(
      '{{}"description":"","producers":[],"consumers":[],"exchanges":[{{}"x": 400, "y": 150, "name": "Exchange", "type": "direct"}],"queues":[],"bindings":[]}'
    )
    cy.get('#importBtn').click()
    cy.window().its('scene.actors.length').should('equal', 1)
  })

  it('Import RMQ definition', () => {
    cy.get('#export').click()
    cy.get('#imexportPanel').should('be.visible')
    cy.get('#ImExport').clear()
    cy.get('#ImExport').type(
      '{{}"rabbit_version":"4.0.4","queues":[{{}"name":"system-events","vhost":"vhost","durable":true,"auto_delete":false,"arguments":{{}"x-queue-type":"quorum","x-message-ttl":30000,"x-dead-letter-exchange":"err-events","x-dead-letter-routing-key":"err","x-max-length":5}},{{}"name":"classic-queue","vhost":"vhost","durable":true,"auto_delete":false,"arguments":{{}}},{{}"name":"stream-events","vhost":"vhost","durable":true,"auto_delete":false,"arguments":{{}"x-queue-type":"stream"}},{{}"name":"federation-queue","vhost":"vhost","durable":true,"auto_delete":false,"arguments":{{}}}],"exchanges":[{{}"name":"events","vhost":"vhost","type":"topic","durable":true,"auto_delete":false,"internal":false,"arguments":{{}"alternate-exchange":"err-events"}},{{}"name":"err-events","vhost":"vhost","type":"fanout","durable":true,"auto_delete":false,"internal":false,"arguments":{{}}},{{}"name":"federation-exchange","vhost":"vhost","type":"topic","durable":true,"auto_delete":false,"internal":false,"arguments":{{}}}],"bindings":[{{}"source":"events","vhost":"vhost","destination":"system-events","destination_type":"queue","routing_key":"#"},{{}"source":"events","vhost":"vhost","destination":"stream-events","destination_type":"queue","routing_key":"#"},{{}"source":"events","vhost":"vhost","destination":"federation-queue","destination_type":"queue","routing_key":"#"}]}'
    )
    cy.get('#importRmqBtn').click()
    cy.window().then((w) => {
      const actors = w.scene.actors
      expect(actors.length).to.equal(7)
      const exchange = actors.find(
        (a) => a.constructor.name === 'Exchange' && a.name === 'events'
      )
      const altExchange = actors.find(
        (a) => a.constructor.name === 'Exchange' && a.name === 'err-events'
      )
      expect(exchange.alternate).to.equal(altExchange)
      const quorum = actors.find(
        (a) => a.constructor.name === 'Queue' && a.name === 'system-events'
      )
      expect(quorum.type).to.equal('quorum')
      expect(quorum.msgTtl).to.equal(30000)
      expect(quorum.dlx).to.equal(altExchange)
      expect(quorum.dlxrk).to.equal('err')
      expect(quorum.maxLength).to.equal(5)
      const classic = actors.find(
        (a) => a.constructor.name === 'Queue' && a.name === 'classic-queue'
      )
      expect(classic.type).to.equal('classic')
      const stream = actors.find(
        (a) => a.constructor.name === 'Queue' && a.name === 'stream-events'
      )
      expect(stream.type).to.equal('stream')
    })
  })
})
