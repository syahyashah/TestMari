import { login } from "../../support/custom_functions.js";
import "cypress-xpath";

describe("Login to Mari", () => {
    // Login
    it("00 LOGIN", () => {
        login();
    });
});

describe("Workflow to parse a file", () => {
    it("Navigating to Knowledge Base", () => {
        
        // DASHBOARD
        cy.get("#addid").click();
        cy.get("#addid").click();
        cy.contains("heading").should("be.visible");
    });
});