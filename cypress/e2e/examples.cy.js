describe('Test examples', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Direct exchange example', () => {
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
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"Queue","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":130,"name":"Consumer","consumes":[0],"mode":"ack"}],"exchanges":[{"x":400,"y":150,"name":"Exchange","type":"direct","alternate":null}],"queues":[{"x":650,"y":150,"name":"Queue","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""}]}'
      )
    })

    it('Generate direct curl definition', () => {
      cy.get('#exampleTopology').select('Direct Exchange')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })

    it('Generate direct rabbitmqadmin definition', () => {
      cy.get('#exampleTopology').select('Direct Exchange')
      cy.get('#generateRabbitmqadmin').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="direct" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue" routing_key=""\n\n'
      )
    })

    it('Generate direct terraform definition', () => {
      cy.get('#exampleTopology').select('Direct Exchange')
      cy.get('#generateTerraform').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "direct"\n    durable     = true\n    auto_delete = false\n  }\n}\nvariable "Queueargs" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue" {\n  name  = "Queue"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queueargs}"\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\n'
      )
    })

    it('Generate direct asyncapi definition', () => {
      cy.get('#exampleTopology').select('Direct Exchange')
      cy.get('#generateAsyncApi').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        "asyncapi: 3.0.0\ninfo:\n  title: RabbitMQ\n  description: Broker description.\n  version: 0.0.1\n  termsOfService: https://asyncapi.org/terms/\n  contact:\n    name: API Support\n    url: https://www.asyncapi.org/support\n    email: support@asyncapi.org\n  license:\n    name: Apache 2.0\n    url: https://www.apache.org/licenses/LICENSE-2.0.htm  \nservers:\n  production:\n    host: localhost\n    protocol: amqps\n    protocolVersion: 0.9.1\n    description: Production broker.\n    tags:\n      - name: env:production\n        description: This environment is the live environment available for final users\nchannels:\n  Exchange:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: routingKey\n        exchange:\n          name: Exchange\n          type: \'direct\'\n          durable: true\n          autoDelete: false\n          vhost: /\n  Queue:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\noperations:\n  sendExchange/:\n    channel:\n      $ref: \'#/channels/Exchange\'\n    action: send\n  receiveQueue:\n    channel:\n      $ref: \'#/channels/Queue\'\n    action: receive  \ncomponents:\n  messages:\n    Event:\n      name: EventName\n      title: Event Title\n      summary: Summary of the event.\n      description: Event description\n      contentType: application/json\n      tags:\n        - name: message\n        - name: example\n      headers:\n        type: object\n        properties:\n          correlationId:\n            description: Correlation ID set by application\n            type: string\n          applicationInstanceId:\n            description: Unique identifier for a given instance of the publishing application\n            type: string\n      payload:\n        type: object\n        additionalProperties: false\n        properties:\n          created:\n            type: string\n            description: The date and time a message was sent.\n            format: datetime\n          name:\n            type: string\n            description: The name of the message was sent.\n          value:\n            type: string\n            description: The value of the message was sent."
      )
    })
  })

  describe('Fanout exchange example', () => {
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
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":50,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":150,"name":"Consumer 2","consumes":[1],"mode":"ack"},{"x":800,"y":250,"name":"Consumer 3","consumes":[2],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"fanout","alternate":null}],"queues":[{"x":650,"y":80,"name":"Queue 1","type":"quorum","maxLength":""},{"x":650,"y":170,"name":"Queue 2","type":"quorum","maxLength":""},{"x":650,"y":260,"name":"Queue 3","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":0,"queue":1,"routingKey":""},{"exchange":0,"queue":2,"routingKey":""}]}'
      )
    })

    it('Generate fanout curl definition', () => {
      cy.get('#exampleTopology').select('Fanout Exchange')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "fanout", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%203 -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })

    it('Generate fanout rabbitmqadmin definition', () => {
      cy.get('#exampleTopology').select('Fanout Exchange')
      cy.get('#generateRabbitmqadmin').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="fanout" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 1" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 2" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 3" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 1" routing_key=""\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 2" routing_key=""\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 3" routing_key=""\n\n'
      )
    })

    it('Generate fanout terraform definition', () => {
      cy.get('#exampleTopology').select('Fanout Exchange')
      cy.get('#generateTerraform').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "fanout"\n    durable     = true\n    auto_delete = false\n  }\n}\nvariable "Queue-1args" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue-1" {\n  name  = "Queue 1"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queue-1args}"\n  }\n}\nvariable "Queue-2args" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue-2" {\n  name  = "Queue 2"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queue-2args}"\n  }\n}\nvariable "Queue-3args" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue-3" {\n  name  = "Queue 3"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queue-3args}"\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue-1" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-1.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\nresource "rabbitmq_binding" "ExchangeQueue-2" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-2.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\nresource "rabbitmq_binding" "ExchangeQueue-3" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-3.name}"\n  destination_type = "queue"\n  routing_key      = ""\n}\n'
      )
    })

    it('Generate fanout asyncapi definition', () => {
      cy.get('#exampleTopology').select('Fanout Exchange')
      cy.get('#generateAsyncApi').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        "asyncapi: 3.0.0\ninfo:\n  title: RabbitMQ\n  description: Broker description.\n  version: 0.0.1\n  termsOfService: https://asyncapi.org/terms/\n  contact:\n    name: API Support\n    url: https://www.asyncapi.org/support\n    email: support@asyncapi.org\n  license:\n    name: Apache 2.0\n    url: https://www.apache.org/licenses/LICENSE-2.0.htm  \nservers:\n  production:\n    host: localhost\n    protocol: amqps\n    protocolVersion: 0.9.1\n    description: Production broker.\n    tags:\n      - name: env:production\n        description: This environment is the live environment available for final users\nchannels:\n  Exchange:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: routingKey\n        exchange:\n          name: Exchange\n          type: \'fanout\'\n          durable: true\n          autoDelete: false\n          vhost: /\n  Queue_1:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 1\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\n  Queue_2:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 2\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\n  Queue_3:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 3\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\noperations:\n  sendExchange/:\n    channel:\n      $ref: \'#/channels/Exchange\'\n    action: send\n  sendExchange/:\n    channel:\n      $ref: \'#/channels/Exchange\'\n    action: send\n  sendExchange/:\n    channel:\n      $ref: \'#/channels/Exchange\'\n    action: send\n  receiveQueue_1:\n    channel:\n      $ref: \'#/channels/Queue_1\'\n    action: receive\n  receiveQueue_2:\n    channel:\n      $ref: \'#/channels/Queue_2\'\n    action: receive\n  receiveQueue_3:\n    channel:\n      $ref: \'#/channels/Queue_3\'\n    action: receive  \ncomponents:\n  messages:\n    Event:\n      name: EventName\n      title: Event Title\n      summary: Summary of the event.\n      description: Event description\n      contentType: application/json\n      tags:\n        - name: message\n        - name: example\n      headers:\n        type: object\n        properties:\n          correlationId:\n            description: Correlation ID set by application\n            type: string\n          applicationInstanceId:\n            description: Unique identifier for a given instance of the publishing application\n            type: string\n      payload:\n        type: object\n        additionalProperties: false\n        properties:\n          created:\n            type: string\n            description: The date and time a message was sent.\n            format: datetime\n          name:\n            type: string\n            description: The name of the message was sent.\n          value:\n            type: string\n            description: The value of the message was sent."
      )
    })
  })

  describe('Topic exchange example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Topic Exchange')

      cy.window().its('scene.actors.length').should('equal', 13)
    })

    it('Export topic defintion', () => {
      cy.get('#exampleTopology').select('Topic Exchange')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":80,"name":"Producer 1","publishes":{"0":{"exchange":"Exchange","routingKey":"x.y.z","message":{"headers":{},"body":{}}}}},{"x":200,"y":170,"name":"Producer 2","publishes":{"0":{"exchange":"Exchange","routingKey":"x.x.x","message":{"headers":{},"body":{}}}}},{"x":200,"y":260,"name":"Producer 3","publishes":{"0":{"exchange":"Exchange","routingKey":"y.y.y","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":80,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":170,"name":"Consumer 2","consumes":[1],"mode":"ack"},{"x":800,"y":260,"name":"Consumer 3","consumes":[2],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"topic","alternate":null}],"queues":[{"x":650,"y":80,"name":"Queue 1","type":"quorum","maxLength":""},{"x":650,"y":170,"name":"Queue 2","type":"quorum","maxLength":""},{"x":650,"y":260,"name":"Queue 3","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":"x.x.x"},{"exchange":0,"queue":1,"routingKey":"#"},{"exchange":0,"queue":2,"routingKey":"x.y.z"}]}'
      )
    })

    it('Generate topic curl definition', () => {
      cy.get('#exampleTopology').select('Topic Exchange')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "topic", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%203 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%201 -d \'{"routing_key": x.x.x, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%202 -d \'{"routing_key": #, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue%203 -d \'{"routing_key": x.y.z, "arguments": {}}\'\n\n'
      )
    })

    it('Generate topic rabbitmqadmin definition', () => {
      cy.get('#exampleTopology').select('Topic Exchange')
      cy.get('#generateRabbitmqadmin').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'rabbitmqadmin -H localhost -u guest -p guest -V / declare exchange name="Exchange" type="topic" durable=true\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 1" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 2" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare queue name="Queue 3" durable=true arguments=\'{"x-queue-type":"quorum"}\'\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 1" routing_key="x.x.x"\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 2" routing_key="#"\n\nrabbitmqadmin -H localhost -u guest -p guest -V / declare binding source="Exchange" destination_type="queue" destination="Queue 3" routing_key="x.y.z"\n\n'
      )
    })

    it('Generate topic terraform definition', () => {
      cy.get('#exampleTopology').select('Topic Exchange')
      cy.get('#generateTerraform').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'terraform {\n  required_providers {\n    rabbitmq = {\n      source = "cyrilgdn/rabbitmq"\n      version = "1.8.0"\n    }\n  }\n}\nprovider "rabbitmq" {\n  endpoint = "http://localhost:15672"\n  username = "guest"\n  password = "guest"\n}\nresource "rabbitmq_vhost" "vhost" {\n  name = "/"\n}\nresource "rabbitmq_exchange" "Exchange" {\n  name  = "Exchange"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n  settings {\n    type        = "topic"\n    durable     = true\n    auto_delete = false\n  }\n}\nvariable "Queue-1args" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue-1" {\n  name  = "Queue 1"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queue-1args}"\n  }\n}\nvariable "Queue-2args" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue-2" {\n  name  = "Queue 2"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queue-2args}"\n  }\n}\nvariable "Queue-3args" {\n  default = <<EOF\n  {\n    "x-queue-type": "quorum"\n  }\n  EOF\n}\nresource "rabbitmq_queue" "Queue-3" {\n  name  = "Queue 3"\n  vhost = "${rabbitmq_vhost.vhost.name}"\n    \n  settings {\n    durable     = true\n    auto_delete = false\n    arguments_json = "${var.Queue-3args}"\n  }\n}\nresource "rabbitmq_binding" "ExchangeQueue-1" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-1.name}"\n  destination_type = "queue"\n  routing_key      = "x.x.x"\n}\nresource "rabbitmq_binding" "ExchangeQueue-2" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-2.name}"\n  destination_type = "queue"\n  routing_key      = "#"\n}\nresource "rabbitmq_binding" "ExchangeQueue-3" {\n  source           = "${rabbitmq_exchange.Exchange.name}"\n  vhost            = "${rabbitmq_vhost.vhost.name}"\n  destination      = "${rabbitmq_queue.Queue-3.name}"\n  destination_type = "queue"\n  routing_key      = "x.y.z"\n}\n'
      )
    })

    it('Generate topic asyncapi definition', () => {
      cy.get('#exampleTopology').select('Topic Exchange')
      cy.get('#generateAsyncApi').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        "asyncapi: 3.0.0\ninfo:\n  title: RabbitMQ\n  description: Broker description.\n  version: 0.0.1\n  termsOfService: https://asyncapi.org/terms/\n  contact:\n    name: API Support\n    url: https://www.asyncapi.org/support\n    email: support@asyncapi.org\n  license:\n    name: Apache 2.0\n    url: https://www.apache.org/licenses/LICENSE-2.0.htm  \nservers:\n  production:\n    host: localhost\n    protocol: amqps\n    protocolVersion: 0.9.1\n    description: Production broker.\n    tags:\n      - name: env:production\n        description: This environment is the live environment available for final users\nchannels:\n  Exchange_x.x.x          \n    address: \'x.x.x\'\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: routingKey\n        exchange:\n          name: Exchange\n          type: \'topic\'\n          durable: true\n          autoDelete: false\n          vhost: /\n  Exchange_x.y.z          \n    address: \'x.y.z\'\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: routingKey\n        exchange:\n          name: Exchange\n          type: \'topic\'\n          durable: true\n          autoDelete: false\n          vhost: /\n  Queue_1:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 1\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\n  Queue_2:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 2\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\n  Queue_3:\n    messages:\n      event:\n        $ref: \'#/components/messages/Event\'\n    bindings:\n      amqp:\n        is: queue\n        queue:\n          name: Queue 3\n          type: quorum\n          durable: true\n          exclusive: false\n          autoDelete: false\noperations:\n  sendExchange/x.x.x:\n    channel:\n      $ref: \'#/channels/Exchange_x.x.x\'\n    action: send\n  sendExchange/x.y.z:\n    channel:\n      $ref: \'#/channels/Exchange_x.y.z\'\n    action: send\n  receiveQueue_1:\n    channel:\n      $ref: \'#/channels/Queue_1\'\n    action: receive\n  receiveQueue_2:\n    channel:\n      $ref: \'#/channels/Queue_2\'\n    action: receive\n  receiveQueue_3:\n    channel:\n      $ref: \'#/channels/Queue_3\'\n    action: receive  \ncomponents:\n  messages:\n    Event:\n      name: EventName\n      title: Event Title\n      summary: Summary of the event.\n      description: Event description\n      contentType: application/json\n      tags:\n        - name: message\n        - name: example\n      headers:\n        type: object\n        properties:\n          correlationId:\n            description: Correlation ID set by application\n            type: string\n          applicationInstanceId:\n            description: Unique identifier for a given instance of the publishing application\n            type: string\n      payload:\n        type: object\n        additionalProperties: false\n        properties:\n          created:\n            type: string\n            description: The date and time a message was sent.\n            format: datetime\n          name:\n            type: string\n            description: The name of the message was sent.\n          value:\n            type: string\n            description: The value of the message was sent."
      )
    })
  })

  describe('Work Queue example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Work Queue')

      // producer
      cy.get('#canvas').trigger('click', 203, 133)
      cy.get('#producerNameField').should('have.value', 'Producer')
      cy.get('#cancelProducerForm').click()

      // consumer 1
      cy.get('#canvas').trigger('click', 803, 83)
      cy.get('#consumerNameField').should('have.value', 'Consumer 1')
      cy.get('#cancelConsumerForm').click()

      // consumer 2
      cy.get('#canvas').trigger('click', 803, 173)
      cy.get('#consumerNameField').should('have.value', 'Consumer 2')
      cy.get('#cancelConsumerForm').click()

      // consumer 3
      cy.get('#canvas').trigger('click', 803, 263)
      cy.get('#consumerNameField').should('have.value', 'Consumer 3')
      cy.get('#cancelConsumerForm').click()

      // exchange
      cy.get('#canvas').trigger('click', 403, 173)
      cy.get('#exchangeNameField').should('have.value', 'Exchange')
      cy.get('#cancelExchangeForm').click()

      // queue
      cy.get('#canvas').trigger('click', 653, 173)
      cy.get('#queueNameField').should('have.value', 'Queue')
      cy.get('#cancelQueueForm').click()

      // binding
      cy.get('#canvas').trigger('click', 450, 170)
      cy.get('#bindingRoutingKeyField').should('have.value', '')
      cy.get('#cancelBindingForm').click()

      cy.window().its('scene.actors.length').should('equal', 7)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Work Queue')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"Queue","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":80,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":170,"name":"Consumer 2","consumes":[0],"mode":"ack"},{"x":800,"y":260,"name":"Consumer 3","consumes":[0],"mode":"ack"}],"exchanges":[{"x":400,"y":170,"name":"Exchange","type":"direct","alternate":null}],"queues":[{"x":650,"y":170,"name":"Queue","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Work Queue')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })

  describe('Stream example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Stream')

      cy.window().its('scene.actors.length').should('equal', 5)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Stream')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"Queue","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":130,"name":"Consumer","consumes":[0],"mode":"ack"}],"exchanges":[{"x":400,"y":150,"name":"Exchange","type":"direct","alternate":null}],"queues":[{"x":650,"y":150,"name":"Queue","type":"stream","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Stream')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"stream"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })

  describe('Queue TTL example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Queue-Ttl')

      cy.window().its('scene.actors.length').should('equal', 4)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Queue-Ttl')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange","routingKey":"Queue","message":{"headers":{},"body":{}}}}}],"consumers":[],"exchanges":[{"x":400,"y":130,"name":"Exchange","type":"direct","alternate":null}],"queues":[{"x":650,"y":130,"name":"Queue","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Queue-Ttl')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum","x-message-ttl":3000}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange/q/Queue -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })

  describe('Queue max length example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Queue-Max-Length')

      cy.window().its('scene.actors.length').should('equal', 9)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Queue-Max-Length')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange 1","routingKey":"Queue 1","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":80,"name":"Consumer 1","consumes":[1],"mode":"reject"},{"x":800,"y":170,"name":"Consumer 2","consumes":[1],"mode":"ack"}],"exchanges":[{"x":400,"y":80,"name":"Exchange 1","type":"direct","alternate":null},{"x":400,"y":170,"name":"Exchange 2","type":"direct","alternate":null}],"queues":[{"x":650,"y":80,"name":"Queue 1","type":"quorum","maxLength":3,"dlx":1},{"x":650,"y":170,"name":"Queue 2","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":1,"queue":1,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Queue-Max-Length')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%201 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%202 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum","x-dead-letter-exchange":"Exchange 2","x-dead-letter-routing-key":"Queue 2","x-max-length":3}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%201/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%202/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })

  describe('Alternate example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Alternate Exchange')

      cy.window().its('scene.actors.length').should('equal', 9)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Alternate Exchange')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange 1","routingKey":"","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":80,"name":"Consumer 1","consumes":[0],"mode":"ack"},{"x":800,"y":180,"name":"Consumer 2","consumes":[1],"mode":"ack"}],"exchanges":[{"x":400,"y":80,"name":"Exchange 1","type":"direct","alternate":"Exchange 2"},{"x":450,"y":180,"name":"Exchange 2","type":"topic","alternate":null}],"queues":[{"x":650,"y":100,"name":"Queue 1","type":"quorum","maxLength":""},{"x":650,"y":200,"name":"Queue 2","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":1,"queue":1,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Alternate Exchange')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%201 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {"alternate-exchange":"Exchange 2"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%202 -d \'{"type": "topic", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%201/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%202/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })

  describe('Dlx example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Dlx')

      cy.window().its('scene.actors.length').should('equal', 9)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Dlx')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange 1","routingKey":"Queue 1","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":100,"name":"Consumer 1","consumes":[0],"mode":"reject"},{"x":800,"y":170,"name":"Consumer 2","consumes":[1],"mode":"ack"}],"exchanges":[{"x":400,"y":100,"name":"Exchange 1","type":"direct","alternate":null},{"x":400,"y":200,"name":"Exchange 2","type":"direct","alternate":null}],"queues":[{"x":650,"y":100,"name":"Queue 1","type":"quorum","maxLength":"","dlx":1},{"x":650,"y":200,"name":"Queue 2","type":"quorum","maxLength":""}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":1,"queue":1,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Dlx')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%201 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%202 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum","x-dead-letter-exchange":"Exchange 2","x-dead-letter-routing-key":"Queue 2"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%201/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%202/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })

  describe('Retry example', () => {
    it('Rendered like expected', () => {
      cy.get('#exampleTopology').select('Retry')

      cy.window().its('scene.actors.length').should('equal', 8)
    })

    it('Export defintion', () => {
      cy.get('#exampleTopology').select('Retry')
      cy.get('#export').click()
      cy.get('#ImExport').should(
        'have.value',
        '{"description":"","producers":[{"x":200,"y":130,"name":"Producer","publishes":{"0":{"exchange":"Exchange 1","routingKey":"Queue 1","message":{"headers":{},"body":{}}}}}],"consumers":[{"x":800,"y":100,"name":"Consumer 1","consumes":[0],"mode":"reject"}],"exchanges":[{"x":400,"y":100,"name":"Exchange 1","type":"direct","alternate":null},{"x":650,"y":200,"name":"Exchange 2","type":"direct","alternate":null}],"queues":[{"x":650,"y":100,"name":"Queue 1","type":"quorum","maxLength":"","dlx":1},{"x":400,"y":300,"name":"Queue 2","type":"quorum","maxLength":"","dlx":0}],"bindings":[{"exchange":0,"queue":0,"routingKey":""},{"exchange":1,"queue":1,"routingKey":""}]}'
      )
    })

    it('Generate curl definition', () => {
      cy.get('#exampleTopology').select('Retry')
      cy.get('#generateCurl').click({ force: true })
      cy.get('#ImExport').should(
        'have.value',
        'curl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%201 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/exchanges/%2f/Exchange%202 -d \'{"type": "direct", "auto_delete": false, "durable": true, "internal": false, "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%201 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum","x-dead-letter-exchange":"Exchange 2","x-dead-letter-routing-key":"Queue 2"}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPUT http://localhost:15672/api/queues/%2f/Queue%202 -d \'{"auto_delete": false, "durable": true, "arguments": {"x-queue-type":"quorum","x-dead-letter-exchange":"Exchange 1","x-dead-letter-routing-key":"Queue 1","x-message-ttl":3000}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%201/q/Queue%201 -d \'{"routing_key": , "arguments": {}}\'\n\ncurl -u guest:guest -i -H "content-type:application/json" -XPOST http://localhost:15672/api/bindings/%2f/e/Exchange%202/q/Queue%202 -d \'{"routing_key": , "arguments": {}}\'\n\n'
      )
    })
  })
})
