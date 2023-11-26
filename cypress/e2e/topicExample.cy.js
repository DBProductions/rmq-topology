describe('Topic example', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Rendered like expected', () => {
    cy.get('#exampleTopology').select('Topic')

    cy.window().its('scene.actors.length').should('equal', 13)
  })

  it('Export topic defintion', () => {
    cy.get('#exampleTopology').select('Topic')
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[{"x":200,"y":80,"name":"Producer 1","publishes":{"0":{"exchange":"Exchange","routingKey":"x.y.z","message":{"headers":{},"body":{}}}}},{"x":200,"y":170,"name":"Producer 2","publishes":{"0":{"exchange":"Exchange","routingKey":"x.x.x","message":{"headers":{},"body":{}}}}},{"x":200,"y":260,"name":"Producer 3","publishes":{"0":{"exchange":"Exchange","routingKey":"y.y.y","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":80,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":170,"name":"Consumer 2","consumes":[1],"mode":"ack"},{"x":800,"y":260,"name":"Consumer 3","consumes":[2],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"topic"}],"queues":[{"x":650,"y":80,"name":"Queue 1","maxLength":""},{"x":650,"y":170,"name":"Queue 2","maxLength":""},{"x":650,"y":260,"name":"Queue 3","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":"x.x.x"},{"exchange":0,"queue":1,"routingKey":"#"},{"exchange":0,"queue":2,"routingKey":"x.y.z"}]}'
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

  it('Generate topic rabbitmqadmin definition', () => {
    cy.get('#exampleTopology').select('Topic')
    cy.get('#generateRabbitmqadmin').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="topic" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 1" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 2" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 3" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 1" routing_key="x.x.x"\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 2" routing_key="#"\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 3" routing_key="x.y.z"\n\n'
    )
  })

  it('Generate topic terraform definition', () => {
    cy.get('#exampleTopology').select('Topic')
    cy.get('#generateTerraform').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "topic"\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue-1" {\n  name  = "Queue 1"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue-2" {\n  name  = "Queue 2"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue-3" {\n  name  = "Queue 3"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue-1" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-1.name}"\n  destination_type = "queue"\n  routing_key      = "x.x.x"\n}\nresource "rabbitmq_binding" "ExchangeQueue-2" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-2.name}"\n  destination_type = "queue"\n  routing_key      = "#"\n}\nresource "rabbitmq_binding" "ExchangeQueue-3" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-3.name}"\n  destination_type = "queue"\n  routing_key      = "x.y.z"\n}\n'
    )
  })
})
