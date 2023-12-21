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
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "fanout", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%203 -d \'{"routing_key": , "arguments": {}}\'\n\n'
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

  it('Generate fanout asyncapi definition', () => {
    cy.get('#exampleTopology').select('Fanout Exchange')
    cy.get('#generateAsyncApi').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      "asyncapi: 3.0.0\ninfo:\n  title: RabbitMQ\n  description: Broker description.\n  version: 0.0.1\n  termsOfService: https://asyncapi.org/terms/\n  contact:\n    name: API Support\n    url: https://www.asyncapi.org/support\n    email: support@asyncapi.org\n  license:\n    name: Apache 2.0\n    url: https://www.apache.org/licenses/LICENSE-2.0.htm  \nservers:\n  production:\n    host: localhost\n    protocol: amqps\n    protocolVersion: 0.9.1\n    description: Production broker.\n    tags:\n      - name: env:production\n        description: This environment is the live environment available for final users\nchannels:\n  Exchange:\n    messages:\n      event:\n        $ref: '#/components/messages/Event'\n    bindings:\n      amqp:\n        is: routingKey\n        exchange:\n          name: Exchange\n          type: 'fanout'\n          durable: true\n          autoDelete: false\n          vhost: /\n  Queue_1:\n    messages:\n      event:\n        $ref: '#/components/messages/Event'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 1\n          durable: true\n          exclusive: true\n          autoDelete: false\n  Queue_2:\n    messages:\n      event:\n        $ref: '#/components/messages/Event'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 2\n          durable: true\n          exclusive: true\n          autoDelete: false\n  Queue_3:\n    messages:\n      event:\n        $ref: '#/components/messages/Event'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 3\n          durable: true\n          exclusive: true\n          autoDelete: false\noperations:\n  sendExchange:\n    channel:\n      $ref: '#/channels/Exchange'\n    action: send\n  receiveQueue_1:\n    channel:\n      $ref: '#/channels/Queue_1'\n    action: receive\n  receiveQueue_2:\n    channel:\n      $ref: '#/channels/Queue_2'\n    action: receive\n  receiveQueue_3:\n    channel:\n      $ref: '#/channels/Queue_3'\n    action: receive  \ncomponents:\n  messages:\n    Event:\n      name: EventName\n      title: Event Title\n      summary: Summary of the event.\n      description: Event description\n      contentType: application/json\n      tags:\n        - name: message\n        - name: example\n      headers:\n        type: object\n        properties:\n          correlationId:\n            description: Correlation ID set by application\n            type: string\n          applicationInstanceId:\n            description: Unique identifier for a given instance of the publishing application\n            type: string\n      payload:\n        type: object\n        additionalProperties: false\n        properties:\n          created:\n            type: string\n            description: The date and time a message was sent.\n            format: datetime\n          name:\n            type: string\n            description: The name of the message was sent.\n          value:\n            type: string\n            description: The value of the message was sent."
    )
  })
})
