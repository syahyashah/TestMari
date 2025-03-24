import { login, logout } from "../support/custom_functions";
import logins from "../fixtures/logindata.json";

describe("Login Test Scenarios", () => {
  const roles = {
    admin: "/",
    superadmin: "/super-admin",
    user: "/chat",
  };

/** Positive Test Cases **/
Object.keys(roles).forEach((role) => {
  it(`should log in as ${role} and validate access`, () => {
    login(role);
    cy.url().should("include", roles[role]);
    cy.logAction(
      `${role} successfully logged in and redirected to correct dashboard`
    );
    cy.screenshot(`${role}_login successful`);
    logout();
  });
});
});

/** Negative Test Cases - Invalid Logins **/
describe("Negative Login Scenarios", () => {
  it("should show error for incorrect email", () => {
    login({ email: "wrongemail@yopmail.com", pass: logins.admin.pass });
    cy.contains("Email: wrong@yopmail.com is not registered!").should(
      "be.visible"
    );
    cy.screenshot("Invalid Email Error");
  });

  it("should show error for incorrect password", () => {
    login({ email: logins.admin.email, pass: "WrongPassword" });
    cy.contains("Invalid credentials!").should("be.visible");
    cy.screenshot("Invalid Password Error");
  });

  it("should show error for incorrect email and password", () => {
    login({ email: "wrongemail@yopmail.com", pass: "WrongPassword" });
    cy.contains("Email: wrong@yopmail.com is not registered!").should(
      "be.visible"
    );
    cy.screenshot("Invalid Email and Password Error");
  });

  it("should not allow login with empty email", () => {
    login({ email: "", pass: logins.admin.pass });
    cy.contains("Registered email is required").should("be.visible");
    cy.screenshot("Empty Email Error");
  });

  it("should not allow login with empty password", () => {
    login({ email: logins.admin.email, pass: "" });
    cy.contains("Password is required").should("be.visible");
    cy.screenshot("Empty Password Error");
  });

  it("should not allow login with both fields empty", () => {
    login({ email: "", pass: "" });
    cy.contains("Registered email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.screenshot("Empty Email and Password Error");
  });
});

/** API Response Validation **/
describe("API Response Validation for Login", () => {
  it("should validate API response for successful login", () => {
    cy.request({
      method: "POST",
      url: "/api/login",
      body: { email: logins.admin.email, password: logins.admin.pass },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("email", logins.admin.email);
      expect(response.body).to.have.property("sessionToken").and.to.not.be.null;
      expect(response.body.role).to.eq(logins.admin.role);
    });
  });

  it("should validate API response for failed login", () => {
    cy.request({
      method: "POST",
      url: "/api/login",
      body: { email: "wrongemail@yopmail.com", password: "WrongPassword" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property(
        "message",
        "Invalid email or password"
      );
    });
  });
});
