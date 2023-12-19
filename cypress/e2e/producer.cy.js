describe('Producer', () => {
  beforeEach(() => {
    cy.visit('/')
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
})
