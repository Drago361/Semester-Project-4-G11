describe('BookFind Homepage', () => {
  it('loads the homepage and displays main sections', () => {
    cy.visit('http://localhost:8000/');

    // Check for the BookFind logo
    cy.contains('BookFind');

    // Check for the search input
    cy.get('#search-input').should('exist');

    // Check for the Team section
    cy.get('#team').should('exist');

    // Check for the Contact section
    cy.get('#contact').should('exist');
  });

  it('navigates to Team and Contact sections via navbar', () => {
    cy.visit('http://localhost:8000/');

    // Click Team link if it exists in the navbar
    cy.contains('Team').click();
    cy.url().should('include', '#team');
    cy.get('#team').should('be.visible');

    // Click Contact link if it exists in the navbar
    cy.contains('Contact').click();
    cy.url().should('include', '#contact');
    cy.get('#contact').should('be.visible');
  });
});