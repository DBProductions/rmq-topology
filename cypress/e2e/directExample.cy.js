describe('Direct example', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Rendered like expected', () => {
    cy.get('#exampleTopology').select('Direct')

    // producer
    cy.get('#canvas').trigger('click', 203, 133)
    cy.get('#producerNameField').should('have.value', 'Producer')
    cy.get('#cancelProducerForm').click()

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

  it('Generate direct terraform definition', () => {
    cy.get('#exampleTopology').select('Direct')
    cy.get('#generateTerraform').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "direct"\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue" {\n  name  = "Queue"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\n'
    )
  })
})
