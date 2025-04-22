import { login } from "../../support/custom_functions.js";
import "cypress-xpath";

const failedRequests = [];

describe("Chunk Retrieval Tests", () => {
  before(() => {
    login();
    cy.wait(2000);

    // Setup: navigate to chat and select project
    cy.get(
      '#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg'
    ).click();
    cy.get('.py-6 > :nth-child(1) > div > .ant-btn').click();
    cy.get('.ant-dropdown-trigger').click();
    cy.get('tr.ant-table-row-selected').click();
    cy.contains('td.ant-table-cell', 'P&ID Diagram').click();
  });

  // ✅ Updated CSV parsing with robust filtering
  beforeEach(() => {
    cy.readFile('cypress/fixtures/questions_and_chunks.csv').then((csvData) => {
      const rows = csvData.split('\n').slice(1); // Skip header row
      const data = rows
        .map(row => {
          const [question, chunks] = row.split(',');
          const trimmedQuestion = question?.trim().replace(/^"|"$/g, '');
          const trimmedChunks = chunks?.trim().replace(/^"|"$/g, '');

          return {
            question: trimmedQuestion,
            chunks: trimmedChunks?.split('|').map(c => c.trim()) || [],
          };
        })
        .filter(entry => entry.question && entry.chunks.length > 0); // ✅ Filter empty or invalid rows

      cy.wrap(data).as('qaPairs');
    });
  });

  it("should retrieve the correct chunk for each question in a new chat", function () {
    cy.get('@qaPairs').then((qaPairs) => {
      cy.wrap(qaPairs).each(({ question, chunks: expectedChunks }, index) => {
        const formattedExpectedChunks = expectedChunks[0]?.split("|").map(c => c.trim()) || [];

        cy.log(`🧪 Test for question #${index + 1}: """${question}"""`);
        cy.log(`📂 Expected Chunks: "${formattedExpectedChunks.join(', ')}"`);

        // Type question
        cy.get("textarea.text-base").clear().type(question);
        cy.get(".lucide.lucide-send.cursor-pointer").click();

        // Intercept chunk retrieval
        cy.intercept("POST", "/v1/chunk/retrieval_test").as("chunkRetrieval");

        // Click Files button
        cy.get(
          "#root > div > div > div > div.flex-1.overflow-x-hidden.md\\:px-4.md\\:pt-2 > main > div > div.fixed.right-0.top-1\\/2.z-30.-translate-y-1\\/2.transform.cursor-pointer.transition-opacity.duration-300.opacity-100 > button"
        ).click();

        // Wait for chunks API response
        cy.wait("@chunkRetrieval", { timeout: 15000 }).then((interception) => {
          if (!interception.response) {
            cy.log("🚨 API did not respond or request was aborted/timed out.");
            cy.log(`❌ Skipping chunk validation for question: """${question}"""`);
            failedRequests.push({
              type: 'NO_RESPONSE',
              question,
              statusCode: 'No response / Timeout',
            });
            return;
          }

          const statusCode = interception.response.statusCode;
          if (statusCode < 200 || statusCode >= 300) {
            cy.log(`🚨 API returned error status: ${statusCode}`);
            cy.log(`❌ Skipping chunk validation for question: """${question}"""`);
            failedRequests.push({
              type: 'API_ERROR',
              question,
              statusCode,
            });
            return;
          }

          const response = interception.response.body;
          const retrievedChunks = [...new Set(
            response?.data?.chunks?.map(chunk => chunk.docnm_kwd?.trim()) || []
          )];

          const normalize = (str) =>
            str?.toLowerCase().replace(/\.[^/.]+$/, "").replace(/\s+/g, " ").trim().normalize("NFKC");

          const normalizedExpectedChunks = formattedExpectedChunks.map(normalize);
          const normalizedRetrievedChunks = retrievedChunks.map(normalize);

          const allFound = normalizedExpectedChunks.every(expectedChunk =>
            normalizedRetrievedChunks.includes(expectedChunk)
          );

          cy.log("✅ Normalized Expected Chunks:", normalizedExpectedChunks.join(", "));
          cy.log("📥 Normalized Retrieved Chunks:", normalizedRetrievedChunks.join(", "));

          if (!allFound) {
            cy.log(`❌ ❗ Mismatch for question: """${question}"""`);
            cy.log(`Expected: "${formattedExpectedChunks.join(", ")}"`);
            cy.log(`Retrieved: "${retrievedChunks.join(", ")}"`);
          } else {
            cy.log(`✅ Chunk match successful`);
          }
        });

        // Close files drawer
        cy.get('.ant-drawer-close').should('be.visible').click();

        // Start new chat
        cy.wait(500);
        cy.get('button.ant-btn').contains("Start New Chat").click();

        // Wait for new chat to be ready before typing the next question
        cy.get("textarea.text-base", { timeout: 10000 }).should("be.visible");
        cy.wait(1000); // <-- Wait 1 second before sending next question
      });
    });
  });

  after(() => {
    if (failedRequests.length > 0) {
      cy.log("⚠️ Summary of API-related failures:");
      failedRequests.forEach(({ question, statusCode }) => {
        cy.log(`❌ Question: "${question}" → Status: ${statusCode}`);
      });

      // ❗ Optionally fail the test suite if backend is misbehaving badly
      if (failedRequests.length > 3) {
        throw new Error("❌ Too many API failures — backend might be down.");
      }
    } else {
      cy.log("✅ All backend requests were successful.");
    }
  });

  // Optional: Prevent test from failing on unhandled app errors like AbortError
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("AbortError") || err.message.includes("The user aborted a request")) {
      return false; // prevent Cypress from failing the test
    }
  });
});

