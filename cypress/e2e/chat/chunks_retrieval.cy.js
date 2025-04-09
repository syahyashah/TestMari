// import { login } from "../../support/custom_functions.js";
// import "cypress-xpath";
// import Papa from "papaparse";

// describe("📄 Full Chunk File Match from CSV (extension-agnostic)", () => {
//   before(() => {
//     login();
//     cy.wait(2000);

//     // Setup: navigate to chat and select project
//     cy.get('#root > div > div > div > div.flex-1.overflow-x-hidden.false > div > div > div > div > svg').click();
//     cy.get('.py-6 > :nth-child(1) > div > .ant-btn').click();
//     cy.get('.ant-dropdown-trigger').click();
//     cy.get('tr.ant-table-row-selected').click();
//     cy.contains('td.ant-table-cell', 'P&ID Diagram').click();
//   });

//   it("🧪 Validates all expected chunks are present in retrieved_chunks from API", () => {
//     cy.fixture("questions_and_chunks.csv").then((csvData) => {
//       const parsedData = Papa.parse(csvData, { header: true }).data;

//       parsedData.forEach((row, index) => {
//         const question = row["questions"]?.trim();
//         const expectedChunkString = row["chunks"]?.trim();

//         if (!question || !expectedChunkString) return;

//         const expectedChunks = expectedChunkString
//           .split(",")
//           .map(name => name.trim().toLowerCase().replace(/\.[^/.]+$/, "")); // extension-agnostic

//         cy.log(`🧪 Test #${index + 1}`);
//         cy.log(`📌 Question: "${question}"`);
//         cy.log(`📁 Expected Chunks: ${expectedChunks.join(", ")}`);

//         // Intercept API call
//         cy.intercept("POST", "**/chunk/retrieval_test").as("chunkRetrieval");

//         // Send prompt
//         cy.get(".text-base").should("have.length", 1).clear().type(question);
//         cy.get('[class="lucide lucide-send cursor-pointer"]').click();

//         // Wait for response
//         cy.wait("@chunkRetrieval", { timeout: 60000 }).then((interception) => {
//           const retrievedChunks = interception.response.body?.retrieved_chunks || [];

//           const retrievedDocNames = retrievedChunks.map(chunk =>
//             chunk.docnm_kwd?.toLowerCase().trim().replace(/\.[^/.]+$/, "")
//           );

//           cy.log("📥 All Retrieved Chunks:", JSON.stringify(retrievedDocNames));

//           // Check if each expected chunk exists in the retrieved list
//           const missingChunks = expectedChunks.filter(expected => !retrievedDocNames.includes(expected));

//           if (missingChunks.length === 0) {
//             expectedChunks.forEach(chunk => cy.log(`✅ Found: "${chunk}"`));
//           } else {
//             missingChunks.forEach(chunk => cy.log(`❌ Missing: "${chunk}"`));
//           }

//           // Assert all expected chunks are found
//           expect(missingChunks, `❌ Missing expected chunks: ${missingChunks.join(", ")}`).to.be.empty;
//         });

//         // Prepare for next case
//         cy.wait(1000);
//         cy.get('button.ant-btn').contains("Start New Chat").click();
//         cy.wait(2000);
//         cy.get('.ant-dropdown-trigger').click();
//         cy.get('tr.ant-table-row-selected').click();
//         cy.contains('td.ant-table-cell', 'pid').click();
//       });
//     });
//   });
// });
