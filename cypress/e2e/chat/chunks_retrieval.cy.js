import { login } from "../../support/custom_functions.js";
import "cypress-xpath";

const failedRequests = [];
const chunkReportCsv = 'cypress/reports/chunks_retrieval_report.csv';

describe("Chunk Retrieval Tests", () => {
  before(() => {
    login();
    cy.wait(2000);
    cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
    cy.get('.py-6 > :nth-child(1) > div > .ant-btn').click();

    // Prepare CSV file
    cy.writeFile(chunkReportCsv, 'Question,Expected Chunks,Retrieved Chunks,Match,Status\n');
  });

  beforeEach(() => {
    cy.readFile('cypress/fixtures/questions_and_chunks.csv').then((csvData) => {
      const rows = csvData.split('\n').slice(1); // Skip header
      const data = rows
        .map(row => {
          const [question, chunks] = row.split(/,(.+)/); // split only on the first comma
          const trimmedQuestion = question?.trim();
          const trimmedChunks = chunks?.trim();
          return {
            question: trimmedQuestion,
            chunks: trimmedChunks?.split('|').map(c => c.trim()) || [],
          };
        })
        .filter(entry => entry.question && entry.chunks.length > 0);
      cy.wrap(data).as('qaPairs');
    });
  });

  it("should retrieve the correct chunk for each question in a new chat", function () {
    cy.get('@qaPairs').then((qaPairs) => {
      cy.wrap(qaPairs).each(({ question, chunks: expectedChunks }, index) => {
        const formattedExpectedChunks = expectedChunks[0]?.split("|").map(c => c.trim()) || [];

        cy.get('.ant-dropdown-trigger').click();
        cy.get('tr.ant-table-row-selected').click();
        cy.contains('td.ant-table-cell', 'Important PFD').click();
        cy.wait(1000);

        cy.get("textarea.text-base").clear().type(question);
        cy.get(".lucide.lucide-send.cursor-pointer").click();

        cy.intercept("POST", "/v1/chunk/retrieval_test").as("chunkRetrieval");

        cy.get("#root > div > div > div > div.flex-1.overflow-x-hidden.md\\:px-4.md\\:pt-2 > main > div > div.fixed.right-0.top-1\\/2.z-30.-translate-y-1\\/2.transform.cursor-pointer.transition-opacity.duration-300.opacity-100 > button").click();

        cy.wait("@chunkRetrieval", { timeout: 15000 }).then((interception) => {
          if (!interception.response) {
            failedRequests.push({
              type: 'NO_RESPONSE',
              question,
              statusCode: 'No response / Timeout',
            });
            cy.writeFile(chunkReportCsv, `"${question}","${formattedExpectedChunks.join('|')}","ERROR: No Response",None,FAIL\n`, { flag: 'a+' });
            return;
          }

          const statusCode = interception.response.statusCode;
          if (statusCode < 200 || statusCode >= 300) {
            failedRequests.push({
              type: 'API_ERROR',
              question,
              statusCode,
            });
            cy.writeFile(chunkReportCsv, `"${question}","${formattedExpectedChunks.join('|')}","ERROR: Status ${statusCode}",None,FAIL\n`, { flag: 'a+' });
            return;
          }

          const response = interception.response.body;
          const retrievedChunks = [...new Set(response?.data?.chunks?.map(chunk => chunk.docnm_kwd?.trim()) || [])];

          const normalize = (str) =>
            str?.toLowerCase().replace(/\.[^/.]+$/, "").replace(/\s+/g, " ").trim().normalize("NFKC");
          const normalizedExpectedChunks = formattedExpectedChunks.map(normalize);
          const normalizedRetrievedChunks = retrievedChunks.map(normalize);

          const anyFound = normalizedExpectedChunks.some(expectedChunk =>
            normalizedRetrievedChunks.slice(0, 5).includes(expectedChunk)
          );

          const matchStatus = anyFound ? 'Matched in Top 5' : 'Not Found';
          const testStatus = anyFound ? 'PASS' : 'FAIL';

          cy.writeFile(
            chunkReportCsv,
            `"${question}","${formattedExpectedChunks.join('|')}","${retrievedChunks.join('|')}",${matchStatus},${testStatus}\n`,
            { flag: 'a+' }
          );
        });

        cy.get('.ant-drawer-close').should('be.visible').click();
        cy.wait(500);
        cy.get('button.ant-btn').contains("Start New Chat").click();
        cy.get("textarea.text-base", { timeout: 10000 }).should("be.visible");
        cy.wait(1000);
      });
    });
  });

  after(() => {
    if (failedRequests.length > 0) {
      failedRequests.forEach(({ question, statusCode }) => {
        cy.log(`:x: Question: "${question}" → Status: ${statusCode}`);
      });
      if (failedRequests.length > 3) {
        throw new Error(":x: Too many API failures — backend might be down.");
      }
    } else {
      cy.log(":white_check_mark: All backend requests were successful.");
    }
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("AbortError") || err.message.includes("The user aborted a request")) {
      return false;
    }
  });
});
