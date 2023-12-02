describe('UI Component', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Export definition', () => {
    cy.get('#export').click()
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[],"consumers":[],"exchanges":[],"queues":[],"bindings":[]}'
    )
    // copy
    cy.get('#copyBtn').click()
    cy.get('#ImExport').clear()
    cy.get('#ImExport').focus()
  })

  it('Add, move and edit producer', () => {
    cy.get('#newComponent').select('Producer')

    cy.get('#producerNameField')
      .type('CypressProducer')
      .should('have.value', 'CypressProducer')

    cy.get('#sendProducerForm').click()

    cy.window().its('scene.actors.length').should('equal', 1)

    cy.get('#canvas').trigger('click', 203, 33)
    cy.get('#cancelProducerForm').click()

    cy.moveOnCanvas(200, 400, 30, 200)

    cy.get('#canvas').trigger('click', 403, 203)
    cy.get('#producerNameField')
      .type('Edit')
      .should('have.value', 'CypressProducerEdit')

    cy.get('#sendProducerForm').click()

    cy.get('#canvas').trigger('click', 403, 203)

    cy.get('#producerNameField').should('have.value', 'CypressProducerEdit')

    cy.get('#deleteProducerForm').click()

    cy.window().its('scene.actors.length').should('equal', 0)
  })

  it('Add producer and add two exchanges to it', () => {
    // exchanges
    cy.get('#newComponent').select('Exchange')
    cy.get('#exchangeNameField').type('e1').should('have.value', 'e1')
    cy.get('#sendExchangeForm').click()

    cy.get('#newComponent').select('Exchange')
    cy.get('#exchangeNameField').type('e2').should('have.value', 'e2')
    cy.get('#sendExchangeForm').click()

    cy.moveOnCanvas(400, 300, 30, 200)

    // producer
    cy.get('#newComponent').select('Producer')
    cy.get('#producerNameField')
      .type('CypressProducer')
      .should('have.value', 'CypressProducer')
    cy.get('#producerPublishToSelect').select('e1')
    cy.get('#sendProducerForm').click()

    // edit
    cy.get('#canvas').trigger('click', 203, 33)
    cy.get('#producerPublishToSelect').select('e2')
    cy.get('#sendProducerForm').click()

    cy.window().its('scene.actors.length').should('equal', 3)

    cy.get('#canvas').trigger('click', 203, 33)
    cy.get('#producerNameField').should('have.value', 'CypressProducer')
    cy.get('#producerPublishTo').should('have.text', 'e1×e2×')

    cy.get('#cancelProducerForm').click()
  })

  it('Add, move and edit consumer', () => {
    cy.get('#newComponent').select('Consumer')

    cy.get('#consumerNameField')
      .type('CypressConsumer')
      .should('have.value', 'CypressConsumer')

    cy.get('#sendConsumerForm').click()

    cy.get('#canvas').trigger('click', 803, 33)
    cy.get('#cancelConsumerForm').click()

    cy.moveOnCanvas(800, 400, 30, 200)

    cy.get('#canvas').trigger('click', 403, 203)
    cy.get('#consumerNameField')
      .type('Edit')
      .should('have.value', 'CypressConsumerEdit')

    cy.get('#sendConsumerForm').click()

    cy.window().its('scene.actors.length').should('equal', 1)

    cy.get('#canvas').trigger('click', 403, 203)

    cy.get('#consumerNameField').should('have.value', 'CypressConsumerEdit')

    cy.get('#deleteConsumerForm').click()

    cy.window().its('scene.actors.length').should('equal', 0)
  })

  it('Add, move and edit exchange', () => {
    cy.get('#newComponent').select('Exchange')

    cy.get('#exchangeNameField')
      .type('CypressExchange')
      .should('have.value', 'CypressExchange')

    cy.get('#sendExchangeForm').click()

    cy.get('#canvas').trigger('click', 403, 33)
    cy.get('#cancelExchangeForm').click()

    cy.moveOnCanvas(400, 300, 30, 200)

    cy.get('#canvas').trigger('click', 303, 203)
    cy.get('#exchangeNameField')
      .type('Edit')
      .should('have.value', 'CypressExchangeEdit')

    cy.get('#exchangeTypeSelect').should('have.value', 'direct')
    cy.get('#exchangeTypeSelect').select('topic')

    cy.get('#sendExchangeForm').click()

    cy.window().its('scene.actors.length').should('equal', 1)

    cy.get('#canvas').trigger('click', 303, 203)

    cy.get('#exchangeNameField').should('have.value', 'CypressExchangeEdit')
    cy.get('#exchangeTypeSelect').should('have.value', 'topic')

    cy.get('#deleteExchangeForm').click()

    cy.window().its('scene.actors.length').should('equal', 0)
  })

  it('Add, move and edit queue', () => {
    cy.get('#newComponent').select('Queue')

    cy.get('#queueNameField')
      .type('CypressQueue')
      .should('have.value', 'CypressQueue')

    cy.get('#sendQueueForm').click()

    cy.get('#canvas').trigger('click', 653, 33)
    cy.get('#cancelQueueForm').click()

    cy.moveOnCanvas(650, 300, 30, 300)

    cy.get('#canvas').trigger('click', 303, 303)
    cy.get('#queueNameField')
      .type('Edit')
      .should('have.value', 'CypressQueueEdit')

    cy.get('#exchangeTypeSelect').should('have.value', 'direct')

    cy.get('#sendQueueForm').click()

    cy.window().its('scene.actors.length').should('equal', 1)

    cy.get('#canvas').trigger('click', 303, 303)

    cy.get('#queueNameField').should('have.value', 'CypressQueueEdit')

    cy.get('#deleteQueueForm').click()

    cy.window().its('scene.actors.length').should('equal', 0)
  })

  it('Add topology', () => {
    // producer
    cy.get('#newComponent').select('Producer')

    cy.get('#producerNameField')
      .type('CypressProducer')
      .should('have.value', 'CypressProducer')

    cy.get('#sendProducerForm').click()

    // consumer
    cy.get('#newComponent').select('Consumer')

    cy.get('#consumerNameField')
      .type('CypressConsumer')
      .should('have.value', 'CypressConsumer')

    cy.get('#sendConsumerForm').click()

    // exchange
    cy.get('#newComponent').select('Exchange')

    cy.get('#exchangeNameField')
      .type('CypressExchange')
      .should('have.value', 'CypressExchange')

    cy.get('#sendExchangeForm').click()

    // producer to exchange
    cy.get('#canvas').click(200, 30)

    cy.get('#producerPublishToSelect').select('CypressExchange')

    cy.get('#producerRoutingKeyField')
      .type('CypressQueue')
      .should('have.value', 'CypressQueue')

    cy.get('#sendProducerForm').click()

    // queue
    cy.get('#newComponent').select('Queue')

    cy.get('#queueNameField')
      .type('CypressQueue')
      .should('have.value', 'CypressQueue')

    cy.get('#sendQueueForm').click()

    // consumer to queue
    cy.get('#canvas').click(800, 30)

    cy.get('#consumerConsumesFromSelect').select('CypressQueue')

    cy.get('#sendConsumerForm').click()

    // binding
    cy.get('#newComponent').select('Binding')

    cy.get('#sendBindingForm').click()

    // move exchange
    cy.moveOnCanvas(400, 300, 30, 200)

    cy.window().its('scene.actors.length').should('equal', 5)

    // start
    cy.get('#animate').click()

    cy.wait(5000)

    cy.get('#animate').click()
  })
})
