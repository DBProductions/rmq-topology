describe('Queue', () => {
  beforeEach(() => {
    cy.visit('/')
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
})
