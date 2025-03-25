import logins from "../fixtures/logindata.json";
import "cypress-xpath";

/**
 * Logs in a user using a role or custom credentials.
 * @param {string|object} roleOrCredentials - Role (e.g., "admin") or { email, pass }.
 */
export function login(roleOrCredentials = "admin") {
  cy.logAction("Starting login process");

  let credentials =
    typeof roleOrCredentials === "string"
      ? logins[roleOrCredentials]
      : roleOrCredentials;

  if (!credentials) {
    throw new Error(`Invalid role '${roleOrCredentials}' - not found in logindata.json`);
  }

  // Navigate to login page and clear session data
  cy.visit("/").url().should("include", "/login");
  cy.clearCookies().clearLocalStorage();
  cy.window().then((win) => win.sessionStorage.clear());
  cy.reload();

  // Enter credentials (allows empty fields)
  enterCredentials(credentials.email, credentials.pass);
  cy.get(".ant-btn").should("be.visible").click();
  cy.logAction(`Attempted login with email: ${credentials.email || "(empty)"}`);

  // **Check validation messages instead of throwing an error**
  if (!credentials.email) validateError("Registered email is required");
  if (!credentials.pass) validateError("Password is required");
}

/**
 * Logs out the currently logged-in user.
 */
export function logout() {
  cy.logAction("Logging out the user");
  cy.xpath('//*[@id="root"]/div/div/div/div[1]/div[2]/div[4]/div')
    .should("exist")
    .click({ force: true });

  cy.contains("Are you sure you wish to Logout ?").should("be.visible");
  cy.contains(".ant-modal .ant-btn", "Confirm").should("be.visible").click();
  cy.url().should("include", "/login");

  cy.window().then((win) => {
    expect(win.localStorage.getItem("sessionToken")).to.be.null;
    cy.logAction("Session token cleared after logout");
  });
}

/**
 * Enters login credentials.
 * @param {string} email - User email.
 * @param {string} password - User password.
 */
function enterCredentials(email, password) {
  cy.get("#email").should("be.visible").clear();
  if (email) {
    cy.get("#email").type(email, { force: true });
  }

  cy.get("#password").should("be.visible").clear();
  if (password) {
    cy.get("#password").type(password, { log: false, force: true });
  }
}

/**
 * Validates error messages.
 * @param {string} message - Expected error text.
 */
function validateError(message) {
  cy.get(".ant-form-item-explain-error", { timeout: 3000 })
    .should("be.visible")
    .and("contain", message);
  cy.screenshot(`Error - ${message}`);
}