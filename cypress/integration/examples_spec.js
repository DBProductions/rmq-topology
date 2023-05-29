describe('Test examples', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Direct example', () => {
    cy.get('#exampleTopology').select('Direct')

    // producer
    cy.get('#canvas').trigger('click', 203, 133)

    cy.get('#producerNameField').should('have.value', 'Producer')

    // consumer
    cy.get('#canvas').trigger('click', 803, 133)

    cy.get('#consumerNameField').should('have.value', 'Consumer')
    cy.get('#cancelConsumerForm').click()

    cy.window().its('scene.actors.length').should('equal', 5)
  })

  it('Fanout example', () => {
    cy.get('#exampleTopology').select('Fanout')

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

  it('Topic example', () => {
    cy.get('#exampleTopology').select('Topic')

    cy.window().its('scene.actors.length').should('equal', 12)
  })

  it('Queue TTL example', () => {
    cy.get('#exampleTopology').select('Queue-Ttl')

    cy.window().its('scene.actors.length').should('equal', 4)
  })

  it('Queue max length example', () => {
    cy.get('#exampleTopology').select('Queue-Max-Length')

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
