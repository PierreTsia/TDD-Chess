export class PlaygroundPage {
  chessBoard = '[data-test-id="chessboard"]'
  chessSquare = '.chess-square'
  chessPiece = '[data-test-id="chess-piece"]'
  startButton = '[data-test-id="start-button"]'
  switchPovButton = '[data-test-id="switch-pov-button"]'


  visit() {
    cy.visit('/playground')
  }

  verifyUrl() {
    cy.url().should('eq', 'http://localhost:3333/playground')
  }

  startGame() {
    this.getStartButton().should('exist').click()
  }

  getChessBoard() {
    return cy.get(this.chessBoard)
  }

  getChessSquare() {
    return cy.get(this.chessSquare)
  }

  getStartButton() {
    return cy.get(this.startButton)
  }

  getPovButton() {
    return cy.get(this.switchPovButton)
  }

  getChessPiece() {
    return cy.get(this.chessPiece)
  }

  switchPosition(){
    this.getPovButton().should('exist').click()
  }

  verifyEmptyChessBoard() {
    this.verifyChessBoard()
    this.getChessPiece().should('have.length', 0)
  }

  verifyChessBoard() {
    this.getChessBoard().should('exist')
    this.getChessSquare().should('have.length', 64)
  }

  verifyStartGame() {
    this.getStartButton().should('exist').click()
    this.getChessPiece().should('have.length', 32)
  }

  verifyBlackPov() {
    this.getChessBoard().should('have.class', 'rotate-180')
  }

  verifyWhitePov() {
    this.getChessBoard().should('not.have.class', 'rotate-180')
  }
}
