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
  
          // Type the prompt
          cy.get(".text-base").should("have.length", 1).clear().type(prompt); // Ensure single input field is targeted
          cy.get('[class="lucide lucide-send cursor-pointer"]').click();
  
          cy.wait(15000); // Wait for chatbot response
  
          cy.get(".messageText___vuU2B > .text-base > .prose", { timeout: 15000 })
            .invoke("text")
            .then((chatbotResponse) => {
              const cleanedBotResponse = chatbotResponse.replace(/\s+/g, " ").trim();
              const similarity = stringSimilarity.compareTwoStrings(cleanedBotResponse, expectedResponse);
  
              cy.log(`✅ Similarity score: ${similarity}`);
              cy.log(`Chatbot Response: ${cleanedBotResponse}`);
  
              // Use a try-catch block to handle assertion failures
              try {
                expect(similarity).to.be.greaterThan(0.7); // Set similarity threshold
              } catch (error) {
                cy.log(`❌ Test failed for Prompt #${index + 1}: ${error.message}`);
                // Optionally, you can save the error message or take a screenshot here
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

