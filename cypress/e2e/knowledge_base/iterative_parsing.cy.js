import { login } from "../../support/custom_functions.js";
import "cypress-xpath";

describe("Dataset File Status Continuous Check (Multi-Page)", () => {
  beforeEach(() => {
    login();
    cy.wait(2000);
    cy.url().should("include", "/");
    cy.visit("https://ai.stixor.com/knowledge/dataset?id=da8dedc4660f11f0acc50242c0a8d007&page=2&size=10");
    cy.wait(5000);
  });

  function checkStatuses() {
    cy.log("🔎 Checking dataset page...");

    let hasParsingFile = false;
    let allSuccess = true;
    let hasFailed = false;

    cy.get("table tbody tr").each(($row, index) => {
      const rowNum = index + 1;

      cy.wrap($row).find("td").eq(5).invoke("text").then((statusText) => {
        cy.log(`Row ${rowNum} Status: ${statusText}`);

        if (statusText.includes("Unparse") || statusText.includes("Cancel")) {
          cy.wrap($row).find("td").eq(5).find("svg").click({ force: true });
          cy.log(`▶️ Clicked play on row ${rowNum}`);
          allSuccess = false;
        } else if (statusText.includes("%")) {
          hasParsingFile = true;
          allSuccess = false;
          cy.log(`⏳ Row ${rowNum} is parsing...`);
        } else if (statusText.includes("Fail")) {
          hasFailed = true;
          allSuccess = false;
          cy.log(`❌ Row ${rowNum} failed. Stopping script.`);
        } else if (statusText.includes("Success")) {
          cy.log(`✅ Row ${rowNum} Success`);
        }
      });
    });

    cy.then(() => {
      if (hasFailed) {
        cy.log("🛑 Script stopped because a file's Parsing status is failed.");
        return; // 🚨 Exit gracefully, no further checks
      }

      if (hasParsingFile) {
        cy.log("⏳ At least one file is parsing → waiting 10 minutes before re-check...");
        cy.wait(600000).then(() => {
          cy.reload();
          cy.wait(5000);
          checkStatuses(); // 🔁 recursive re-check
        });
      } else if (allSuccess) {
        cy.log("✅ All rows on this page are Success!");

        cy.get("body").then(($body) => {
          if ($body.find(".ant-pagination-next:not(.ant-pagination-disabled) > .ant-pagination-item-link").length > 0) {
            cy.log("➡️ Going to next page...");
            cy.get(".ant-pagination-next > .ant-pagination-item-link").click({ force: true });
            cy.wait(5000);
            checkStatuses(); // 🔁 move to next page
          } else {
            cy.log("🏁 Reached last page. Monitoring complete!");
          }
        });
      } else {
        cy.log("⚠️ Not all Success yet → re-checking in 10 minutes...");
        cy.wait(600000).then(() => {
          cy.reload();
          cy.wait(5000);
          checkStatuses(); // 🔁 keep checking
        });
      }
    });
  }

  it("Continuously monitors files across pages", () => {
    checkStatuses();
  });
});
