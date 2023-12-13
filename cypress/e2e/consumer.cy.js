describe('Consumer', () => {
  beforeEach(() => {
    cy.visit('/')
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
})
