import 'cypress-plugin-api';

Cypress.Commands.add("logAction", (message) => {
    cy.task("logToFile", message);
  });
  