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
  cy.get(':nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input-affix-wrapper').type(user.email);
  cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input-affix-wrapper').type(user.pass);
  cy.get('.ant-btn').click();

  
}