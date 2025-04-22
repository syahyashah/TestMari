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


  // it("create a user without filling out all required fields", () => {
  //   cy.contains('button', 'Create User').should('be.visible').click();
  //   cy.contains('button', 'Create').should('be.visible').click();

  //   cy.contains('.ant-form-item-explain-error', 'First name is required').should('be.visible');
  //   cy.contains('.ant-form-item-explain-error', 'Last name is required').should('be.visible');
  //   cy.contains('.ant-form-item-explain-error', 'Email is required').should('be.visible');
  //   cy.contains('.ant-form-item-explain-error', 'Please select at least one knowledge base').should('be.visible');

  //   // Close the modal (if there is a cancel or close button)
  //   cy.contains('button', 'Cancel').click(); // Adjust if cancel button label is different
  //   cy.wait(1000);
  // });


//   // first name field valdation checks
//   it("should show error for invalid first name", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_first_name').clear().type('test name 123'); 
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Name can only contain alphabetic characters and spaces.').should('be.visible');
//   });

//   it("should show error for too short first name", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_first_name').clear().type('t'); 
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Name must be at least 2 characters long.').should('be.visible');
//   });

//   it("should show error for too long first name", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_first_name').clear().type('a very very very very very very very very long name'); 
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Name cannot exceed 50 characters.').should('be.visible');
//   });

//   it("should show error for multiple spaces in between first name", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_first_name').clear().type('test  name'); 
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Name cannot contain multiple spaces.').should('be.visible');
//   });

//   it("should show error for trailing and leading spaces for first name", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_first_name').clear().type(' test  name '); 
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Name cannot have leading or trailing spaces.').should('be.visible');
//   });

// // last name field validation checks
// it("should show error for invalid last name", () => {
//   cy.contains('button', 'Create User').should('be.visible').click();
//   cy.contains('button', 'Create').should('be.visible');
//   cy.get('#custom-form_last_name').clear().type('test name 123'); 
//   cy.contains('button', 'Create').click();
//   cy.contains('.ant-form-item-explain-error', 'Name can only contain alphabetic characters and spaces.').should('be.visible');
// });

// it("should show error for too short last name", () => {
//   cy.contains('button', 'Create User').should('be.visible').click();
//   cy.contains('button', 'Create').should('be.visible');
//   cy.get('#custom-form_last_name').clear().type('t'); 
//   cy.contains('button', 'Create').click();
//   cy.contains('.ant-form-item-explain-error', 'Name must be at least 2 characters long.').should('be.visible');
// });

// it("should show error for too long last name", () => {
//   cy.contains('button', 'Create User').should('be.visible').click();
//   cy.contains('button', 'Create').should('be.visible');
//   cy.get('#custom-form_last_name').clear().type('a very very very very very very very very long name'); 
//   cy.contains('button', 'Create').click();
//   cy.contains('.ant-form-item-explain-error', 'Name cannot exceed 50 characters.').should('be.visible');
// });

// it("should show error for multiple spaces in between last name", () => {
//   cy.contains('button', 'Create User').should('be.visible').click();
//   cy.contains('button', 'Create').should('be.visible');
//   cy.get('#custom-form_last_name').clear().type('test  name'); 
//   cy.contains('button', 'Create').click();
//   cy.contains('.ant-form-item-explain-error', 'Name cannot contain multiple spaces.').should('be.visible');
// });

// it("should show error for trailing and leading spaces for last name", () => {
//   cy.contains('button', 'Create User').should('be.visible').click();
//   cy.contains('button', 'Create').should('be.visible');
//   cy.get('#custom-form_last_name').clear().type(' test  name '); 
//   cy.contains('button', 'Create').click();
//   cy.contains('.ant-form-item-explain-error', 'Name cannot have leading or trailing spaces.').should('be.visible');
// });

// // phone number field validation checks
//   it("should show error for invalid phone number", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_phone_no').type('123'); // too short
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Phone number must be 10 digits').should('be.visible');
//   });

//   // email field validation checks
//   it("should show error for invalid email", () => {
//     cy.contains('button', 'Create User').should('be.visible').click();
//     cy.contains('button', 'Create').should('be.visible');
//     cy.get('#custom-form_email').clear().type('invalid-email'); // missing @domain
//     cy.contains('button', 'Create').click();
//     cy.contains('.ant-form-item-explain-error', 'Please enter a valid email address').should('be.visible');
//   });
  
    it("creating a new unregistered user", () => {
      cy.contains('button', 'Create User').should('be.visible').click();
      cy.contains('button', 'Create').should('be.visible');
      cy.get('#custom-form_first_name').clear().type('John');
      cy.get('#custom-form_last_name').clear().type('Doe');
      cy.get('#custom-form_phone_no').type('1234567890');
      cy.get('#custom-form_email').clear().type('john.doe@example.com');


      cy.get('.ant-select-selection-overflow').click();

      // Wait for the dropdown to appear, then select the option
      cy.get('.rc-virtual-list-holder')
        .contains('TyB KB')
        .click();
      
      cy.contains('button', 'Create').click();

      cy.contains('User created successfully').should('be.visible');
    });

    it("creating a user that already exist", () => {
      cy.contains('button', 'Create User').should('be.visible').click();
      cy.contains('button', 'Create').should('be.visible');
      cy.get('#custom-form_first_name').clear().type('John');
      cy.get('#custom-form_last_name').clear().type('Doe');
      cy.get('#custom-form_phone_no').type('1234567890');
      cy.get('#custom-form_email').clear().type('john.doe@example.com');


      cy.get('.ant-select-selection-overflow').click();

      // Wait for the dropdown to appear, then select the option
      cy.get('.rc-virtual-list-holder')
        .contains('TyB KB')
        .click();
      
      cy.contains('button', 'Create').click();

      cy.contains('Email: john.doe@example.com has already registered!').should('be.visible');
    });
});
