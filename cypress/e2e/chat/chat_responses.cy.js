import { login } from "../../support/custom_functions.js";
import stringSimilarity from "string-similarity";
import "cypress-xpath";
import Papa from "papaparse"; // CSV parser

const chatbotReportCsv = 'cypress/reports/chat_responses.csv';

describe("Chatbot Response Validation", () => {
  before(() => {
    login();
    cy.wait(2000);
    cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
    cy.get('.py-6 > :nth-child(1) > div > .ant-btn').click();
    cy.get('.ant-dropdown-trigger').click();
    cy.get('tr.ant-table-row-selected').click();
    cy.contains('td.ant-table-cell', 'Important PFD').click();

    // Prepare CSV report
    cy.writeFile(chatbotReportCsv, 'Prompt,Expected Response,Actual Response,Similarity,Status\n');
  });

  it("Validates chatbot responses from CSV file", () => {
    cy.fixture("questions_and_responses.csv").then((csvData) => {
      const parsedData = Papa.parse(csvData, { header: true }).data;

      cy.wrap(parsedData).each((row, index) => {
        const prompt = row["Prompt"]?.trim();
        const expectedResponse = row["Expected Response"]?.replace(/\s+/g, " ").trim();

        if (!prompt || !expectedResponse) {
          cy.log(`⚠️ Skipping empty row at index ${index}`);
          return;
        }

        cy.log(`🔹 Testing Prompt #${index + 1}: "${prompt}"`);

        cy.intercept('POST', '/v1/chat/completion').as('chatbotResponse');

        cy.get(".text-base").should("have.length", 1).clear().type(prompt);
        cy.get('[class="lucide lucide-send cursor-pointer"]').click();

        cy.wait('@chatbotResponse', { timeout: 50000 }).then((interception) => {
          const status = interception.response?.statusCode;
          if (!interception.response || status !== 200) {
            cy.log(`❌ Chat Completion API failed for Prompt: "${prompt}"`);
            cy.log(`Status: ${status || 'No Response'}`);
            cy.writeFile(chatbotReportCsv, `"${prompt}","${expectedResponse}","ERROR: No Response",0,FAIL\n`, { flag: 'a+' });
            return;
          }

          cy.get(".messageText___vuU2B > .text-base > .prose", { timeout: 50000 })
            .should('not.be.empty')
            .should('be.visible')
            .invoke("text")
            .then((chatbotResponse) => {
              const cleanedBotResponse = chatbotResponse.replace(/\s+/g, " ").trim();
              const similarity = stringSimilarity.compareTwoStrings(cleanedBotResponse, expectedResponse);
              const status = similarity > 0.7 ? 'PASS' : 'FAIL';

              cy.log(`✅ Similarity score: ${similarity}`);
              cy.log(`Chatbot Response: ${cleanedBotResponse}`);

              cy.writeFile(
                chatbotReportCsv,
                `"${prompt}","${expectedResponse}","${cleanedBotResponse}",${similarity.toFixed(2)},${status}\n`,
                { flag: 'a+' }
              );
            });
        });

        cy.wait(2000);
        cy.get('button.ant-btn').contains("Start New Chat").click();
        cy.wait(2000);
        cy.get('.ant-dropdown-trigger').click();
        cy.get('tr.ant-table-row-selected').click();
        cy.contains('td.ant-table-cell', 'Important PFD').click();
      });
    });
  });
});
