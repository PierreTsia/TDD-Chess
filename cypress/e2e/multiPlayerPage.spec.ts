import { MultiPlayerPage } from './Pages/MultiPlayerPage'

context('|-> Multiplayer Page', () => {
  let page: MultiPlayerPage
  beforeEach(() => {
    page = new MultiPlayerPage()
    page.visit()
  })

  it('should display something', () => {
    page.verifyUrl()
    page.verifyNotLoggedIn()
    page.logIn('alice@example.com', 'testtest')
    cy.wait(1000)
    page.verifyLoggedIn('Alice')
  })
})
