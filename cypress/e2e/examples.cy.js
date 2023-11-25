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

  it('Export direct defintion', () => {
    cy.get('#exampleTopology').select('Direct')
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"Queue","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":130,"name":"Consumer","consumes":[0],"mode":"ack"}],"exchanges":[{"x":400,"y":150,"name":"Exchange","type":"direct"}],"queues":[{"x":650,"y":150,"name":"Queue","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""}]}'
    )
  })

  it('Generate direct curl definition', () => {
    cy.get('#exampleTopology').select('Direct')
    cy.get('#generateCurl').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
    )
  })

  it('Generate direct rabbitmqadmin definition', () => {
    cy.get('#exampleTopology').select('Direct')
    cy.get('#generateRabbitmqadmin').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="direct" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue" routing_key=""\n\n'
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

  it('Export fanout defintion', () => {
    cy.get('#exampleTopology').select('Fanout')
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":50,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":150,"name":"Consumer 2","consumes":[1],"mode":"ack"},{"x":800,"y":250,"name":"Consumer 3","consumes":[2],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"fanout"}],"queues":[{"x":650,"y":80,"name":"Queue 1","maxLength":""},{"x":650,"y":170,"name":"Queue 2","maxLength":""},{"x":650,"y":260,"name":"Queue 3","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":0,"queue":1,"routingKey":""},{"exchange":0,"queue":2,"routingKey":""}]}'
    )
  })

  it('Generate fanout curl definition', () => {
    cy.get('#exampleTopology').select('Fanout')
    cy.get('#generateCurl').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "fanout", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%203 -d \'{"routing_key": , "arguments": {}}\'\n\n'
    )
  })

  it('Topic example', () => {
    cy.get('#exampleTopology').select('Topic')

    cy.window().its('scene.actors.length').should('equal', 12)
  })

  it('Export topic defintion', () => {
    cy.get('#exampleTopology').select('Topic')
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[{"x":200,"y":130,"name":"Producer 1","publishes":{"0":{"exchange":"Exchange","routingKey":"x.y.z","message":{"headers":{},"body":{}}}}},{"x":200,"y":200,"name":"Producer 2","publishes":{"0":{"exchange":"Exchange","routingKey":"x.x.x","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":80,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":170,"name":"Consumer 2","consumes":[1],"mode":"ack"},{"x":800,"y":260,"name":"Consumer 3","consumes":[2],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"topic"}],"queues":[{"x":650,"y":80,"name":"Queue 1","maxLength":""},{"x":650,"y":170,"name":"Queue 2","maxLength":""},{"x":650,"y":260,"name":"Queue 3","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":"x.x.x"},{"exchange":0,"queue":1,"routingKey":"#"},{"exchange":0,"queue":2,"routingKey":"x.y.z"}]}'
    )
  })

  it('Generate topic curl definition', () => {
    cy.get('#exampleTopology').select('Topic')
    cy.get('#generateCurl').click({ force: true })
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
