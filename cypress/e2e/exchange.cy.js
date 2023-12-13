describe('Exchange', () => {
  beforeEach(() => {
    cy.visit('/')
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
})
