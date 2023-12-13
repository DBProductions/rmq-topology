describe('UI Component', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Start Stop Timer', () => {
    cy.get('#animate').should('have.text', ' Start')
    cy.get('#animate').click()
    cy.get('#animate').should('have.text', ' Stop')
    cy.window().its('timer.running').should('equal', true)
    cy.get('#animate').click()
    cy.get('#animate').should('have.text', ' Start')
    cy.window().its('timer.running').should('equal', false)
  })

  it('Export definition', () => {
    cy.get('#export').click()
    cy.get('#imexportPanel').should('be.visible')
    cy.get('#ImExport').should(
      'have.value',
      '{"description":"","producers":[],"consumers":[],"exchanges":[],"queues":[],"bindings":[]}'
    )
    // copy
    cy.get('#copyBtn').click()
    cy.assertValueCopiedToClipboard(
      '{"description":"","producers":[],"consumers":[],"exchanges":[],"queues":[],"bindings":[]}'
    )
    cy.get('#ImExport').clear()
    cy.get('#ImExport').focus()
    cy.get('#copyBtn').click()
    cy.assertValueCopiedToClipboard('')
  })
})
