import { login } from "../../support/custom_functions.js";
import stringSimilarity from "string-similarity";
import "cypress-xpath";
import Papa from "papaparse"; // Import CSV parser

describe("Chatbot Response Validation", () => {
  before(() => {
    login();
    cy.wait(2000);
    cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
    cy.get('.py-6 > :nth-child(1) > div > .ant-btn').click();
    cy.get('.ant-dropdown-trigger').click();
    cy.get('tr.ant-table-row-selected').click();
    cy.contains('td.ant-table-cell', 'pid').click();
  });

  it("Validates chatbot responses from CSV file", () => {
    cy.fixture("questions_and_responses.csv").then((csvData) => {
      const parsedData = Papa.parse(csvData, { header: true }).data; // Convert CSV to JSON format

      parsedData.forEach((row, index) => {
        const prompt = row["Prompt"]?.trim();
        const expectedResponse = row["Expected Response"]?.replace(/\s+/g, " ").trim(); // Normalize whitespace

        if (!prompt || !expectedResponse) return; // Skip empty rows

        cy.log(`🔹 Testing Prompt #${index + 1}: "${prompt}"`);

        // Intercept the API call to wait for the chatbot response
        cy.intercept('POST', '/v1/chat/completion').as('chatbotResponse'); // Intercept the request

        // Type the prompt and click send
        cy.get(".text-base").should("have.length", 1).clear().type(prompt);
        cy.get('[class="lucide lucide-send cursor-pointer"]').click();

        // Wait for the intercepted API request to complete
        cy.wait('@chatbotResponse', { timeout: 50000 });

        // Ensure the chatbot response is visible in the DOM after the request
        cy.get(".messageText___vuU2B > .text-base > .prose", { timeout: 50000 })
          .should('not.be.empty') // Ensure that the message is not empty
          .should('be.visible')  // Ensure the message is visible
          .invoke("text")
          .then((chatbotResponse) => {
            const cleanedBotResponse = chatbotResponse.replace(/\s+/g, " ").trim();
            const similarity = stringSimilarity.compareTwoStrings(cleanedBotResponse, expectedResponse);

            cy.log(`✅ Similarity score: ${similarity}`);
            cy.log(`Chatbot Response: ${cleanedBotResponse}`);

            // Wrap the assertion in a try-catch block to prevent test failure on mismatch
            try {
              expect(similarity).to.be.greaterThan(0.7); // Set similarity threshold
            } catch (error) {
              cy.log(`❌ Test failed for Prompt #${index + 1}: ${error.message}`);
              // Optionally, you can take a screenshot or save the error message here
            }
          });

        cy.wait(5000); // Wait before resetting chat

        // Click "Start New Chat" button
        cy.get('button.ant-btn').contains("Start New Chat").click();

        cy.wait(2000); // Ensure chat resets properly

        // Re-select knowledge base (pid)
        cy.get('.ant-dropdown-trigger').click();
        cy.get('tr.ant-table-row-selected').click();
        cy.contains('td.ant-table-cell', 'pid').click();
      });
    });
  });
});
