
import { login } from "../../support/custom_functions.js";
import "cypress-xpath";

describe("Knowledge Base CRUD Operations", () => {
  let kbName;

  before(() => {
    // Generate once and store globally
    kbName = "Test KB " + Date.now();
    Cypress.env("kbName", kbName);
  });

  beforeEach(() => {
    // Login and navigate to KB page before each test
    login();
    cy.wait(2000);
    cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
    cy.wait(1000);
    cy.get(':nth-child(3) > .link-wrapper > p').click();
    cy.wait(1000);
  });

  it("Creates a new Knowledge Base", () => {
    cy.get('.lg\\:flex-row > .flex > .ant-btn > :nth-child(2)').click();
    cy.get('#Create_name').type(Cypress.env("kbName"));
    cy.get('#Create > .flex > :nth-child(1)').click();
    cy.wait(2000);
    cy.contains('h4.line-clamp-2', Cypress.env("kbName")).should('exist');
  });

  it("Uploads and parses a file in the Knowledge Base", () => {
    const kb = Cypress.env("kbName");
  
    // Step 1: Visit Knowledge Base screen
    cy.visit("https://dev-ai.stixor.com/knowledge");
    cy.url().should("include", "/knowledge");
  
    // Step 2: Find the KB and click the dataset navigation button
    cy.contains('h4.line-clamp-2', kb, { timeout: 10000 })
      .should('exist')
        cy.get(':nth-child(1) > .gap-9 > .ant-btn > span').click(); // Dataset screen button
  
    cy.wait(2000); // Optional wait before upload begins
  
    // Step 3: Upload a file
    cy.get('.justify-between > .flex > .ant-btn > :nth-child(2)').click();
    cy.get('.py-2 > .gap-2').click();
    cy.get('input[name="file"]').selectFile('cypress/fixtures/IntegratedFacilitiesManagement.pdf', { force: true });
    cy.get('.file-upload > :nth-child(2) > .ant-btn').click();
  
    // Step 4: Confirm file uploaded
    cy.get('.h-10').should('contain', 'Unparse');
  
    // Step 5: Trigger parsing
    cy.get('.operationIcon___PnxaJ').click();
    cy.wait(30000); // Wait for parsing to complete
    cy.reload();
  
    // Step 6: Ensure parsing completed successfully
    cy.get('.ant-progress', { timeout: 30000 }).should('not.exist');
    cy.get('.h-10').should('contain', 'Success');
  });
  
  

  it("Deletes the created Knowledge Base", () => {
    const kb = Cypress.env("kbName");

    cy.visit("https://dev-ai.stixor.com/knowledge").url().should("include", "/knowledge");

    cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > main > div > div.ant-spin-nested-loading.css-13xyp08 > div > div > div:nth-child(1) > div.flex.items-center.justify-between > span > svg').trigger('mouseover', { force: true });
    
        cy.get('.ant-dropdown')
        .should('be.visible') // Ensure dropdown is visible before clicking
        .within(() => {
          // Click the delete button inside the dropdown
          cy.get('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child').click();
          cy.wait(1000);
        });

    cy.get('.ant-modal-wrap.ant-modal-centered').should('be.visible');
    cy.contains('button', 'Confirm').click();

    cy.contains('h4.line-clamp-2', kb).should('not.exist');
  });
});

