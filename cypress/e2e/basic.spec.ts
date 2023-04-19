context('|-> Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display an empty chessboard and a start button', () => {
    cy.url().should('eq', 'http://localhost:3333/')

    cy.get('[data-test-id="chessboard"]').should('exist')

    cy.get('.chess-square').should('have.length', 64)

    cy.get('[data-test-id="chess-piece"]').should('have.length', 0)

    cy.get('[data-test-id="start-button"]').should('exist').click()

    cy.get('[data-test-id="chess-piece"]').should('have.length', 32)
  })

  it('should display a switch pov button', () => {
    cy.get('[data-test-id="start-button"]').should('exist').click()
    cy.get('[data-test-id="square-7-7"]').should('exist')
    cy.get('[data-test-id="square-7-7"] .white').should('exist')
    cy.get('[data-test-id="square-0-0"] .black').should('exist')

    cy.get('[data-test-id="chessboard"] .rotate-180').should('not.exist')

    cy.get('[data-test-id="switch-pov-button"]').should('exist').click()
    cy.get('[data-test-id="chessboard"] .rotate-180').should('exist')

    cy.get('[data-test-id="square-7-7"] .white').should('exist')
    cy.get('[data-test-id="square-0-0"] .black').should('exist')
  })
})
