describe('UI Component', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it.skip('Start Stop Timer', () => {
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
      '{{}"rabbit_version":"4.0.4","rabbitmq_version":"4.0.4","product_name":"RabbitMQ","product_version":"4.0.4","users":[],"vhosts":[],"permissions":[],"topic_permissions":[],"parameters":[],"global_parameters":[],"policies":[],"queues":[{{}"name":"system-events","vhost":"vhost","durable":true,"auto_delete":false,"arguments":{{}"x-queue-type":"quorum"}}],"exchanges":[{{}"name":"events","vhost":"vhost","type":"topic","durable":true,"auto_delete":false,"internal":false,"arguments":{{}}}],"bindings":[{{}"source":"events","vhost":"vhost","destination":"system-events","destination_type":"queue","routing_key":"#"}]}'
    )
    cy.get('#importRmqBtn').click()
    cy.window().its('scene.actors.length').should('equal', 3)
  })
})
