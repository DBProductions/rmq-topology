describe('Test components', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Producer', () => {
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

    it('Add producer and two exchanges to publish', () => {
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
  })

  describe('Consumer', () => {
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
  })

  describe('Exchange', () => {
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

    it('Exchange name must be unique', () => {
      cy.get('#newComponent').select('Exchange')
      cy.get('#exchangeNameField').type('Exchange')
      cy.get('#sendExchangeForm').click()

      cy.window().its('scene.actors.length').should('equal', 1)

      cy.get('#newComponent').select('Exchange')
      cy.get('#exchangeNameField').type('Exchange')
      cy.get('#sendExchangeForm').click()

      cy.get('#exchangeErr').should(
        'have.text',
        "Exchange with name 'Exchange' already exists."
      )
      cy.window().its('scene.actors.length').should('equal', 1)
    })
  })

  describe('Queue', () => {
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

    it('Queue name must be unique', () => {
      cy.get('#newComponent').select('Queue')
      cy.get('#queueNameField').type('Queue')
      cy.get('#sendQueueForm').click()

      cy.window().its('scene.actors.length').should('equal', 1)

      cy.get('#newComponent').select('Queue')
      cy.get('#queueNameField').type('Queue')
      cy.get('#sendQueueForm').click()

      cy.get('#queueErr').should(
        'have.text',
        "Queue with name 'Queue' already exists."
      )
      cy.window().its('scene.actors.length').should('equal', 1)
    })
  })
})
