describe('Fanout example', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Rendered like expected', () => {
    cy.get('#exampleTopology').select('Fanout Exchange')

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
    cy.get('#exampleTopology').select('Fanout Exchange')
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":50,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":150,"name":"Consumer 2","consumes":[1],"mode":"ack"},{"x":800,"y":250,"name":"Consumer 3","consumes":[2],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"fanout","alternate":null}],"queues":[{"x":650,"y":80,"name":"Queue 1","maxLength":""},{"x":650,"y":170,"name":"Queue 2","maxLength":""},{"x":650,"y":260,"name":"Queue 3","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":0,"queue":1,"routingKey":""},{"exchange":0,"queue":2,"routingKey":""}]}'
    )
  })

  it('Generate fanout curl definition', () => {
    cy.get('#exampleTopology').select('Fanout Exchange')
    cy.get('#generateCurl').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "fanout", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/bindings/e/Exchange/q/Queue%203 -d \'{"routing_key": , "arguments": {}}\'\n\n'
    )
  })

  it('Generate fanout rabbitmqadmin definition', () => {
    cy.get('#exampleTopology').select('Fanout Exchange')
    cy.get('#generateRabbitmqadmin').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="fanout" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 1" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 2" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 3" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 1" routing_key=""\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 2" routing_key=""\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 3" routing_key=""\n\n'
    )
  })

  it('Generate fanout terraform definition', () => {
    cy.get('#exampleTopology').select('Fanout Exchange')
    cy.get('#generateTerraform').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "fanout"\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue-1" {\n  name  = "Queue 1"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue-2" {\n  name  = "Queue 2"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue-3" {\n  name  = "Queue 3"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue-1" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-1.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\nresource "rabbitmq_binding" "ExchangeQueue-2" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-2.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\nresource "rabbitmq_binding" "ExchangeQueue-3" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-3.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\n'
    )
  })
})
