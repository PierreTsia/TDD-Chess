context('|-> Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate to playground and multiplayer page', () => {
    cy.url().should('eq', 'http://localhost:3333/')
    cy.get('[data-test-id="playground-page-btn"]').should('exist').click()
    cy.url().should('eq', 'http://localhost:3333/playground')

    // go back with the browser back button
    cy.go('back')
    cy.url().should('eq', 'http://localhost:3333/')
    cy.get('[data-test-id="multiplayer-page-btn"]').should('exist').click()
    cy.url().should('eq', 'http://localhost:3333/multi')
  })

})
