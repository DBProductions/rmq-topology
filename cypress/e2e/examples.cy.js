describe('Test examples', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Work Queue example', () => {
    cy.get('#exampleTopology').select('Work Queue')

    cy.window().its('scene.actors.length').should('equal', 7)
  })

  it('Queue TTL example', () => {
    cy.get('#exampleTopology').select('Queue-Ttl')

    cy.window().its('scene.actors.length').should('equal', 4)
  })

  it('Queue max length example', () => {
    cy.get('#exampleTopology').select('Queue-Max-Length')

    cy.window().its('scene.actors.length').should('equal', 9)
  })

  it('Alternate example', () => {
    cy.get('#exampleTopology').select('Dlx')

    cy.window().its('scene.actors.length').should('equal', 9)
  })

  it('Dlx example', () => {
    cy.get('#exampleTopology').select('Dlx')

    cy.window().its('scene.actors.length').should('equal', 9)
  })

  it('Retry example', () => {
    cy.get('#exampleTopology').select('Retry')

    cy.window().its('scene.actors.length').should('equal', 8)
  })
})
