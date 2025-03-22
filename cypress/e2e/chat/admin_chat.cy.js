import { login } from "../../support/custom_functions.js";
import stringSimilarity from "string-similarity";
import "cypress-xpath";

describe("Chatbot test", () => {

    before (() => {
        login();
        cy.wait(2000);
        cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
        cy.get('.py-6 > :nth-child(1) > div > .ant-btn').click();
        cy.get('.ant-dropdown-trigger').click(); 
        cy.get('tr.ant-table-row-selected').click(); 
        cy.contains('td.ant-table-cell', 'pid').click();
    });

    it("Prompt 1 - String similarity check with long expected response", () => {
        const prompt = 'what is this kb about?';
        const expectedResponse = `
This knowledge base (KB) contains detailed information about cars, their components, maintenance, and repair processes . It also includes technical data extracted from Piping & Instrumentation Diagrams (P&IDs) related to gas processing facilities . Here's a breakdown of the content:

1. Cars and Automotive Basics
How Cars Work: Explains the basic principles of car operation, including engines, transmissions, and supporting systems like cooling, lubrication, and brakes.
Gas Station Wisdom: Tips for selecting fuel grades and performing basic checks like fluid levels and tire inspections while refueling.
Preventive Maintenance: Guidance on routine tasks such as oil changes and tire replacements to avoid costly repairs.
Troubleshooting: Methods for diagnosing common car problems using observation and troubleshooting charts.
Do-It-Yourself Repairs: Information on what repairs can be done by car owners versus those requiring professional mechanics.
Finding a Mechanic: Tips for identifying trustworthy mechanics with certifications like ASE.

2. Technical Data from P&ID Diagrams
Detailed descriptions of equipment used in gas processing facilities (e.g., amine sweetening units).
Specifications for pipelines, valves, pumps, vessels, instrumentation tags (e.g., flow transmitters), operating conditions (pressure/temperature), materials used in construction (e.g., carbon steel), safety notes, and operational guidelines .
Revision histories of diagrams showing updates made over time.

In summary:
The KB provides practical automotive knowledge for everyday users who want to understand or maintain their vehicles better.
It also serves as a technical reference for professionals working with industrial gas processing systems through detailed P&ID diagram data.
        `.trim();

        cy.get('.text-base').type(prompt);
        cy.get('[class="lucide lucide-send cursor-pointer"]').click();

        // Wait 10 seconds for chatbot response to fully generate
        cy.wait(10000);

        cy.get('.messageText___vuU2B > .text-base > .prose', { timeout: 15000 })
            .invoke('text')
            .then((chatbotResponse) => {
                const cleanedBotResponse = chatbotResponse.replace(/\s+/g, ' ').trim(); // normalize spacing
                const cleanedExpectedResponse = expectedResponse.replace(/\s+/g, ' ').trim();
                const similarity = stringSimilarity.compareTwoStrings(cleanedBotResponse, cleanedExpectedResponse);
                
                cy.log(`Similarity score: ${similarity}`);
                cy.log(`Chatbot Response: ${cleanedBotResponse}`);
                
                expect(similarity).to.be.greaterThan(0.7); // Set a realistic threshold for long texts
            });
    });
});


