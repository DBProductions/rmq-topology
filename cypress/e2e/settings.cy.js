describe('Settings', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Default settings', () => {
    cy.get('#settings').click()

    cy.get('#settingsHost').should('have.value', 'localhost')
    cy.get('#settingsPort').should('have.value', '5672')
    cy.get('#settingsManagement').should(
      'have.value',
      'http://localhost:15672/api'
    )
    cy.get('#settingsVHost').should('have.value', '%2f')
    cy.get('#settingsUsername').should('have.value', 'guest')
    cy.get('#settingsPassword').should('have.value', 'guest')
  })

  it('Default AsyncApi settings', () => {
    cy.get('#settings').click()
    cy.get('#settingsLinkAsyncapi').click()

    cy.get('#settingsAsyncApiTitle').should('have.value', 'RabbitMQ')
    cy.get('#settingsAsyncApiDescription').should(
      'have.value',
      'Broker description.'
    )
    cy.get('#settingsAsyncApiVersion').should('have.value', '0.0.1')
  })

  it('New settings are saved', () => {
    cy.get('#settings').click()
    cy.get('#settingsHost').clear().type('127.0.0.1')
    cy.get('#settingsPort').clear().type('5671')
    cy.get('#settingsManagement').clear().type('https://localhost:15672/api')
    cy.get('#settingsVHost').clear().type('/user')
    cy.get('#settingsUsername').clear().type('rabbit')
    cy.get('#settingsPassword').clear().type('rabbit')

    cy.get('#settingsLinkAsyncapi').click()
    cy.get('#settingsAsyncApiTitle').clear().type('title')
    cy.get('#settingsAsyncApiDescription').clear().type('description')
    cy.get('#settingsAsyncApiVersion').clear().type('0.0.2')

    cy.get('#sendSettingsForm').click()

    cy.reload()

    cy.get('#settings').click()
    cy.get('#settingsHost').should('have.value', '127.0.0.1')
    cy.get('#settingsPort').should('have.value', '5671')
    cy.get('#settingsManagement').should(
      'have.value',
      'https://localhost:15672/api'
    )
    cy.get('#settingsVHost').should('have.value', '/user')
    cy.get('#settingsUsername').should('have.value', 'rabbit')
    cy.get('#settingsPassword').should('have.value', 'rabbit')

    cy.get('#settingsLinkAsyncapi').click()
    cy.get('#settingsAsyncApiTitle').should('have.value', 'title')
    cy.get('#settingsAsyncApiDescription').should('have.value', 'description')
    cy.get('#settingsAsyncApiVersion').should('have.value', '0.0.2')
  })
})
