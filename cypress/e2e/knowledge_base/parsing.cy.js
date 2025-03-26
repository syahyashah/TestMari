import { login } from "../../support/custom_functions.js";
import stringSimilarity from "string-similarity";
import "cypress-xpath";
import Papa from "papaparse"; // Import CSV parser

describe("Chatbot Response Validation", () => {
    before(() => {
      login();
      cy.wait(2000);
      cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
      cy.wait(1000);
      cy.get(':nth-child(3) > .link-wrapper > p').click();



    });
  
    it('should create a KB and then delete it', () => {
        // Generate a unique KB name
        const kbName = 'Test KB ' + Date.now();
    
        // Step 1: Click the "Create Knowledge Base" button
        cy.get('.lg\\:flex-row > .flex > .ant-btn > :nth-child(2)').click();
    
        // Step 2: Type the KB name in the input field
        cy.get('#Create_name').type(kbName);
    
        // Step 3: Click the "Create" button in the modal
        cy.get('#Create > .flex > :nth-child(1)').click();
    
        cy.wait(2000);

        //navigate to the dataset screen
        cy.get(':nth-child(1) > .gap-9 > .ant-btn').click();
        cy.wait(2000);

        //uploading a file on the dataset screen
        cy.get('.justify-between > .flex > .ant-btn > :nth-child(2)').click();
        cy.get('.py-2 > .gap-2').click();
        cy.get('input[name="file"]').selectFile('cypress/fixtures/IntegratedFacilitiesManagement.pdf', { force: true });
        cy.get('.file-upload > :nth-child(2) > .ant-btn').click();




    
        // //hover over the options button
        // cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > main > div > div.ant-spin-nested-loading.css-13xyp08 > div > div > div:nth-child(1) > div.flex.items-center.justify-between > span > svg').trigger('mouseover', { force: true });
    
        // cy.get('.ant-dropdown')
        // .should('be.visible') // Ensure dropdown is visible before clicking
        // .within(() => {
        //   // Step 7: Click the delete button inside the dropdown
        //   cy.get('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child').click();
        // });

        // // Step 6: Click the confirm button in the confirmation modal
        // cy.get(':nth-child(7) > .ant-modal-root > .ant-modal-wrap > .ant-modal > [style="outline: none;"] > .ant-modal-content > .ant-modal-body > .flex-col > .flex > :nth-child(1)').click();
    
        // // Step 7: Verify KB is deleted by checking it no longer exists
        // cy.contains('.kb-card', kbName).should('not.exist');
      });
  });
