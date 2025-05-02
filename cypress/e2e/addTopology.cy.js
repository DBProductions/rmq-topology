describe('Topologies', () => {
  beforeEach(() => {
    cy.visit('/')
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

    // stop
    cy.get('#animate').click()

    cy.window().its('scene.actors[1].arrivedMessages').should('equal', 2)

    // start
    cy.get('#animate').click()

    cy.wait(5000)

    // stop
    cy.get('#animate').click()

    cy.window().its('scene.actors[1].arrivedMessages').should('equal', 7)
  })
})
