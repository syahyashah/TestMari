import { login } from "../../support/custom_functions.js";
import stringSimilarity from "string-similarity";
import "cypress-xpath";

// Prevent test failure on expected validation errors
Cypress.on('uncaught:exception', (err, runnable) => {
  if (
    err.message.includes('First name is required') ||
    err.message.includes('[object Object]')
  ) {
    return false;
  }
});

describe("create user screen +ve, -ve and validation check cases", () => {
  beforeEach(() => {
    login();
    cy.wait(2000);
    cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
    cy.get('[href="/user"] > p').click();
    cy.wait(2000);
  });
