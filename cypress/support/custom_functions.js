import logins from "../fixtures/logindata.json";
import "cypress-xpath";

export function login(role = "admin") {
  cy.logAction(`Starting login process for ${role}`);

  if (!logins[role]) {
    throw new Error(`Role '${role}' not found in logindata.json`);
  }

  const user = logins[role];

  cy.visit("/");
  cy.url().should("include", "/login");
  cy.get(".h-full > .text-center").should("be.visible");

  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => win.sessionStorage.clear());
  cy.logAction("Cleared cookies, localStorage, and sessionStorage");

  cy.reload();

  cy.get(".ant-input")
    .its("length")
    .then((count) => cy.log(`Found ${count} input fields`));

  cy.get("#email")
    .should("be.visible")
    .clear()
    .type(user.email, { force: true });
  cy.get("#password")
    .should("be.visible")
    .clear()
    .type(user.pass, { log: false, force: true });

  cy.get(".ant-btn").should("be.visible").click();
  cy.logAction(`Entered credentials for ${role} and clicked login`);

  cy.url().should("include", "/");
  cy.logAction(`${role} login successful, redirected to dashboard`);
}

export function logout() {
  cy.logAction("Logging out the user");

  cy.xpath('//*[@id="root"]/div/div/div/div[1]/div[2]/div[4]/div')
    .should("exist")
    .click({ force: true });

  cy.contains("Are you sure you wish to Logout ?").should("be.visible");
  cy.get(".white-btn").should("be.visible");
  cy.get(".mt-8 > :nth-child(1)").should("be.visible").click();

  cy.url().should("include", "/login");
  cy.get(".h-full > .text-center").should("be.visible");
  cy.logAction("User successfully logged out");

  cy.window().then((win) => {
    const sessionToken = win.localStorage.getItem("sessionToken");
    expect(sessionToken).to.be.null;
    cy.logAction("Session token cleared after logout");
  });
}
