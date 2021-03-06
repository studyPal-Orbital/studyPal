/// <reference types="cypress" />

describe('User can type out tasks on a sticky note', () => {
    beforeEach(() => {
      /* Visit website */
      cy.visit('http://localhost:3000')
  
      /* Landing page */
      cy.contains('div','studyPal')
      cy.contains('div','A productivity application to help you plan your busy days!')
      cy.get('[data-cy="greeting-img"]')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
      cy.get('[data-cy="log-in"]').click()
  
      /* Log in page */ 
      cy.get('[data-cy="email-input"]').type('test123@email.com')
      cy.get('[data-cy="password-input"]').type('test12345')
      cy.get('[data-cy="log-in-account"]').click()
  
      /* Home Page */
      cy.get('[data-cy="home-img"]').should('be.visible')
      cy.get('[data-cy="greeting"]').should('be.visible')
      cy.get('[data-cy="upcoming-event"]').should('be.visible')
  
      /* Forum Page */
      cy.get('[data-cy="forum-header"]').click()
    })

    it('Place square block only at allowed time intervals', () => {
        cy.get('[data-cy="nav-to-canvas"]').click()
        cy.get('[data-cy="change-color"]').click()
        cy.get('[data-cy="canvas-grid"]').click()
        cy.on('window:alert',(t)=>{expect(t).to.contains('Come back again')})
        cy.get('[data-cy="nav-back-forum"]').click()
        cy.get('[data-cy="forum"]').contains('Forum')
    })
})