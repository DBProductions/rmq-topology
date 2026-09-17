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

    cy.wait(2500)

    // stop
    cy.get('#animate').click()

    cy.window().its('timer.running').should('equal', false)
  })

  it('Add exchange-to-exchange binding', () => {
    // exchange 1
    cy.get('#newComponent').select('Exchange')

    cy.get('#exchangeNameField')
      .type('E2ESource')
      .should('have.value', 'E2ESource')

    cy.get('#sendExchangeForm').click()

    // exchange 2
    cy.get('#newComponent').select('Exchange')

    cy.get('#exchangeNameField').type('E2EDest').should('have.value', 'E2EDest')

    cy.get('#sendExchangeForm').click()

    // binding from E2ESource to E2EDest
    cy.get('#newComponent').select('Binding')

    cy.get('#bindingSource').select('E2ESource')
    cy.get('#bindingDestinationType').select('exchange')
    cy.get('#bindingDestination').select('E2EDest')
    cy.get('#bindingRoutingKeyField').type('#').should('have.value', '#')

    cy.get('#sendBindingForm').click()

    cy.window().its('scene.actors.length').should('equal', 3)

    cy.window()
      .its('scene.actors')
      .then((actors) => {
        const binding = actors.find((a) => a.routingKey === '#')
        expect(binding.source.name).to.equal('E2ESource')
        expect(binding.destination.name).to.equal('E2EDest')
        expect(binding.destination.radius).to.equal(15)
      })
  })
})
