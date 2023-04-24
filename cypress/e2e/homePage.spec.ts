context('|-> Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate to playground  page', () => {
    cy.url().should('eq', 'http://localhost:3333/')
    cy.get('[data-test-id="playground-page-btn"]').should('exist').click()
    cy.url().should('eq', 'http://localhost:3333/playground')
  })

  it.skip('should navigate to multiplayer page', () => {
    cy.url().should('eq', 'http://localhost:3333/')
    cy.get('[data-test-id="multiplayer-page-btn"]').should('exist').click()
    cy.url().should('eq', 'http://localhost:3333/multi')
  })
})
