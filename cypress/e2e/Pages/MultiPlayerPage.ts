export class MultiPlayerPage {
  emailInput = '[data-test-id="login-email"]'
  passwordInput = '[data-test-id="login-password"]'

  logoutButton = '[data-test-id="logout-btn"]'
  loginButton = '[data-test-id="login-btn"]'
  userName = '[data-test-id="login-username"]'

  visit() {
    cy.visit('/multi')
  }

  verifyUrl() {
    cy.url().should('eq', 'http://localhost:3333/multi')
  }

  verifyNotLoggedIn() {
    cy.get(this.emailInput).should('exist')
    cy.get(this.passwordInput).should('exist')
    cy.get(this.logoutButton).should('not.exist')
    cy.get(this.userName).should('not.exist')
  }

  logIn(email: string, password: string) {
    cy.get(this.emailInput).should('exist').type(email)
    cy.get(this.passwordInput).should('exist').type(password)
    cy.get(this.loginButton).should('exist').click()
  }

  verifyLoggedIn(name:string) {
    cy.get(this.emailInput).should('not.exist')
    cy.get(this.passwordInput).should('not.exist')
    cy.get(this.logoutButton).should('exist')
    cy.get(this.userName).should('exist').should('include.text', name)
  }
}
