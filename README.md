# Cypress Automation Project for Testing Mari

## Project Overview
This project is a Cypress automation framework designed to test an AI chatbot system. The tests ensure the chatbot's functionality, responsiveness, and accuracy in providing responses.

## Prerequisites
Before running the tests, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Cypress](https://www.cypress.io/)
- A code editor (e.g., VS Code)
- Git

## Installation
Clone the repository and install dependencies:

```sh
# Clone the repository
git clone https://github.com/syahyashah/TestMari.git

# Install dependencies
npm install
```

## Project Structure
```
project-folder/
│-- cypress/
│   │-- e2e/    # Test cases
│   │-- fixtures/       # Test data
│   │-- support/        # Helper functions
│-- cypress.json        # Cypress configuration file
│-- package.json        # Project dependencies
│-- README.md           # Project documentation
```

## Running Tests
To execute tests, use the following commands:

### Run all tests in headless mode:
```sh
npx cypress run
```

### Run tests in the Cypress Test Runner:
```sh
npx cypress open
```

## Writing Tests
Test files are located in `cypress/e2e/`. Each test file should follow Cypress best practices. Example:

```js
describe('Chatbot Test Suite', () => {
    it('should load the chatbot and display a welcome message', () => {
        cy.visit('https://your-chatbot-url.com');
        cy.get('.chatbox').should('be.visible');
        cy.get('.message').contains('Welcome');
    });
});
```

## Reporting
You can generate test reports using Cypress plugins like `mochawesome`:

```sh
npx cypress run --reporter mochawesome
```

## CI/CD Integration
Cypress can be integrated with CI/CD tools like GitHub Actions, Jenkins, or GitLab CI. Configure your pipeline to install dependencies and run Cypress tests as part of your deployment process.
