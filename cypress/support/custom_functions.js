import user from '../fixtures/logindata.json';

export function login() {
  // Visit the base URL
  cy.visit('/');

  // Clear cookies, localStorage, and sessionStorage
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });

  // Reload the page to reset state
  cy.reload();

  // Perform the login steps
  cy.get('/html/body/div[1]/div/div/div[2]/div[2]/div/form/div/div[1]/div/div/div/div/span/input').type(user.email);
  cy.get('/html/body/div[1]/div/div/div[2]/div[2]/div/form/div/div[2]/div/div/div/div/span').type(user.pass);
  cy.get('/html/body/div[1]/div/div/div[2]/div[2]/div/form/button').click();

  // Wait for the dropdown to be visible and select the feedyard
//   cy.get('#ddlFeedyardList', { timeout: 10000 }).should('be.visible').select(user.database);
//   cy.get('#btnConnect').click();

  // Verify successful login by checking for a specific element on the dashboard
  //cy.get('#fenster-fence', { timeout: 10000 }).should('be.visible');
}