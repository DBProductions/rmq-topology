describe('Test examples', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Direct example', () => {
    cy.get('#exampleTopology').select('Direct')

    // producer
    cy.get('#canvas').trigger('click', 203, 133)

    cy.get('#producerNameField').should('have.value', 'Producer')

    // consumer
    cy.get('#canvas').trigger('click', 803, 133)

    cy.get('#consumerNameField').should('have.value', 'Consumer')
    cy.get('#cancelConsumerForm').click()

    cy.window().its('scene.actors.length').should('equal', 5)
  })

  it('Generate direct curl definition', () => {
    cy.get('#exampleTopology').select('Direct')
    cy.get('#generateCurl').click({force: true})
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
    )
  })

  it('Fanout example', () => {
    cy.get('#exampleTopology').select('Fanout')

    // producer
    cy.get('#canvas').trigger('click', 203, 133)

    cy.get('#producerNameField').should('have.value', 'Producer')

    // consumer 1
    cy.get('#canvas').trigger('click', 803, 53)

    cy.get('#consumerNameField').should('have.value', 'Consumer 1')
    cy.get('#cancelConsumerForm').click()

    // consumer 2
    cy.get('#canvas').trigger('click', 803, 153)

    cy.get('#consumerNameField').should('have.value', 'Consumer 2')
    cy.get('#cancelConsumerForm').click()

    // consumer 3
    cy.get('#canvas').trigger('click', 803, 253)

    cy.get('#consumerNameField').should('have.value', 'Consumer 3')
    cy.get('#cancelConsumerForm').click()

    cy.window().its('scene.actors.length').should('equal', 11)
  })

  it('Generate fanout curl definition', () => {
    cy.get('#exampleTopology').select('Fanout')
    cy.get('#generateCurl').click({force: true})
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "fanout", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%203 -d \'{"routing_key": , "arguments": {}}\'\n\n'
    )
  })

  it('Topic example', () => {
    cy.get('#exampleTopology').select('Topic')

    cy.window().its('scene.actors.length').should('equal', 12)
  })

  it('Generate topic curl definition', () => {
    cy.get('#exampleTopology').select('Topic')
    cy.get('#generateCurl').click({force: true})
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "topic", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%201 -d \'{"routing_key": x.x.x, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%202 -d \'{"routing_key": #, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%203 -d \'{"routing_key": x.y.z, "arguments": {}}\'\n\n'
    )
  })

  it('Queue TTL example', () => {
    cy.get('#exampleTopology').select('Queue-Ttl')

    cy.window().its('scene.actors.length').should('equal', 4)
  })

  it('Queue max length example', () => {
    cy.get('#exampleTopology').select('Queue-Max-Length')

    cy.window().its('scene.actors.length').should('equal', 9)
  })

  it('Dlx example', () => {
    cy.get('#exampleTopology').select('Dlx')

    cy.window().its('scene.actors.length').should('equal', 9)
  })

  it('Retry example', () => {
    cy.get('#exampleTopology').select('Retry')

    cy.window().its('scene.actors.length').should('equal', 8)
  })
})
