Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions from the app
  return false;
});

describe('Homepage, Admin Login, and Favorite Button E2E Test', () => {
  it('Visits homepage, logs in as admin, and tests favorite button', () => {
    // 1. Visit homepage
    cy.visit('http://localhost:8000/');
    cy.wait(1000);

    // 2. Go to login page using nav link (adjust if needed)
    cy.get('a.nav-link').contains('Login').click();

    // 3. Fill in admin credentials and submit
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin'); // Replace with actual admin password
    cy.get('form').submit();

    // 4. Confirm login by checking for a profile or logout link
    cy.get('a.nav-link').contains(/profile|logout/i).should('exist');    

    // 5. Find a book and click the favorite/star button
    cy.get('.book-card').first().within(() => {
      cy.get('.star-btn').click();
      cy.get('.star-btn').click(); // Click again to favorite
      // Check for a visual change
      cy.get('.star-btn.filled').should('exist');
    });

    // 6. Search for a specific book and favorite it
    cy.get('#search-input').type('Harry Potter and the Chamber of Secrets');
    cy.get('#search-button').click(); // or submit the form if needed

    // 7. Wait for search results and favorite the book
    cy.contains('.book-card', 'Harry Potter').within(() => {
      cy.get('.star-btn').click();
      cy.get('.star-btn').click(); // Click again to favorite
      cy.get('.star-btn.filled').should('exist');
    });

    // 8. Go to Favorites/Profile page and check if the book appears
    cy.get('a.nav-link').contains(/profile|favorites/i).click();
    cy.get('.book-card').should('exist');
    cy.get('.book-card').contains('Harry Potter and the Chamber of Secrets').should('exist');
  });
});