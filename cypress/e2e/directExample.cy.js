describe('Direct example', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Rendered like expected', () => {
    cy.get('#exampleTopology').select('Direct Exchange')

    // producer
    cy.get('#canvas').trigger('click', 203, 133)
    cy.get('#producerNameField').should('have.value', 'Producer')
    cy.get('#cancelProducerForm').click()

    // consumer
    cy.get('#canvas').trigger('click', 803, 133)
    cy.get('#consumerNameField').should('have.value', 'Consumer')
    cy.get('#cancelConsumerForm').click()

    // exchange
    cy.get('#canvas').trigger('click', 403, 153)
    cy.get('#exchangeNameField').should('have.value', 'Exchange')
    cy.get('#cancelExchangeForm').click()

    // queue
    cy.get('#canvas').trigger('click', 653, 153)
    cy.get('#queueNameField').should('have.value', 'Queue')
    cy.get('#cancelQueueForm').click()

    // binding
    cy.get('#canvas').trigger('click', 450, 150)
    cy.get('#bindingRoutingKeyField').should('have.value', '')
    cy.get('#cancelBindingForm').click()

    cy.window().its('scene.actors.length').should('equal', 5)
  })

  it('Export direct defintion', () => {
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"Queue","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":130,"name":"Consumer","consumes":[0],"mode":"ack"}],"exchanges":[{"x":400,"y":150,"name":"Exchange","type":"direct","alternate":null}],"queues":[{"x":650,"y":150,"name":"Queue","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""}]}'
    )
  })

  it('Generate direct curl definition', () => {
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.get('#generateCurl').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
    )
  })

  it('Generate direct rabbitmqadmin definition', () => {
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.get('#generateRabbitmqadmin').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="direct" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue" routing_key=""\n\n'
    )
  })

  it('Generate direct terraform definition', () => {
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.get('#generateTerraform').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "direct"\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_queue" "Queue" {\n  name  = "Queue"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\n'
    )
  })

  it('Generate direct asyncapi definition', () => {
    cy.get('#exampleTopology').select('Direct Exchange')
    cy.get('#generateAsyncApi').click({ force: true })
    cy.get('#ImExport').should(
      'have.value',
      "asyncapi: 3.0.0\ninfo:\n  title: RabbitMQ\n  description: Broker description.\n  version: 0.0.1\n  termsOfService: https://asyncapi.org/terms/\n  contact:\n    name: API Support\n    url: https://www.asyncapi.org/support\n    email: support@asyncapi.org\n  license:\n    name: Apache 2.0\n    url: https://www.apache.org/licenses/LICENSE-2.0.htm  \nservers:\n  production:\n    host: localhost\n    protocol: amqps\n    protocolVersion: 0.9.1\n    description: Production broker.\n    tags:\n      - name: env:production\n        description: This environment is the live environment available for final users\nchannels:\n  Exchange:\n    messages:\n      event:\n        $ref: '#/components/messages/Event'\n    bindings:\n      amqp:\n        is: routingKey\n        exchange:\n          name: Exchange\n          type: 'direct'\n          durable: true\n          autoDelete: false\n          vhost: /\n  Queue:\n    messages:\n      event:\n        $ref: '#/components/messages/Event'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue\n          durable: true\n          exclusive: true\n          autoDelete: false\noperations:\n  sendExchange/:\n    channel:\n      $ref: '#/channels/Exchange_'\n    action: send\n  receiveQueue:\n    channel:\n      $ref: '#/channels/Queue'\n    action: receive  \ncomponents:\n  messages:\n    Event:\n      name: EventName\n      title: Event Title\n      summary: Summary of the event.\n      description: Event description\n      contentType: application/json\n      tags:\n        - name: message\n        - name: example\n      headers:\n        type: object\n        properties:\n          correlationId:\n            description: Correlation ID set by application\n            type: string\n          applicationInstanceId:\n            description: Unique identifier for a given instance of the publishing application\n            type: string\n      payload:\n        type: object\n        additionalProperties: false\n        properties:\n          created:\n            type: string\n            description: The date and time a message was sent.\n            format: datetime\n          name:\n            type: string\n            description: The name of the message was sent.\n          value:\n            type: string\n            description: The value of the message was sent."
    )
  })
})
