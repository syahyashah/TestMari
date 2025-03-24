## 🚀 Cypress Automation Project for Testing Mari

## 📌 Project Overview
This project is a Cypress automation framework designed to test an AI chatbot system. The tests ensure the chatbot's functionality, responsiveness, and accuracy in providing responses.

## ⚙️ Prerequisites
Before running the tests, make sure you have the following installed:

✅ Node.js (LTS version recommended)
✅ Cypress
✅ A code editor (e.g., VS Code)
✅ Git



## 📥 Installation
Clone the repository and install dependencies:

# Clone the repository
git clone https://github.com/syahyashah/TestMari.git

# Navigate into the project folder
cd TestMari

# Install dependencies
npm install

## 📂 Project Structure
## Project Structure
```bash
project-folder/
│-- cypress/
│   │-- e2e/           # Test cases
│   │-- fixtures/      # Test data
│   │-- support/       # Helper functions
│   │-- logs/          # Test execution logs
│   │-- reports/       # Test reports
│   │-- screenshots/   # Screenshots of test runs
│-- cypress.config.js  # Cypress configuration file
│-- package.json       # Project dependencies & scripts
│-- README.md          # Project documentation
```

## 🚀 Running Tests
To execute tests, use the following commands:

### 🟢 Run all tests in headless mode:
```sh
npm run test
```

### 🟢 Run all tests in headless mode and generate a report:
```sh
npm run test:report
```

### 🟢 Run all tests in headless mode, select E2E mode, and use Chrome browser:
```sh
npm run test:e2e:chrome
```

### 🟢 Open Cypress interactive test runner:
```sh
npm run open
```

### 🟢 Open Cypress interactive test runner, select E2E mode, and use Chrome browser:
```sh
npm run open:e2e:chrome
```

### 🟢 Open Cypress interactive test runner, select E2E mode, use Chrome browser, and generate a report:
```sh
npm run open:e2e:chrome:report
```

### 🟢 Run a specific test file in headless mode:
Replace <YOUR_TEST_FILE> with the actual filename inside cypress/e2e/
```sh
npm run test:file --spec cypress/e2e/<YOUR_TEST_FILE>.cy.js
```
Example:
```sh
npm run test:file --spec cypress/e2e/login_scenarios.cy.js
```

## 🖊️ Writing Tests
Test files are located in cypress/e2e/. Each test file should follow Cypress best practices. Example:

```js
describe('Chatbot Test Suite', () => {
    it('should load the chatbot and display a welcome message', () => {
        cy.visit('https://your-chatbot-url.com');
        cy.get('.chatbox').should('be.visible');
        cy.get('.message').contains('Welcome');
    });
});
```

## 📊 Test Reporting
After running tests, reports are automatically generated in cypress/reports/.

To manually generate a report, run:
```sh
npm run test:report
```
This will create a Mochawesome report in the cypress/reports/ directory.

## 📸 Screenshots & Logs
📌 Screenshots of failed tests are saved in cypress/screenshots/
📌 Test execution logs are saved in cypress/logs/test-log.txt

🧹 Each time the tests run, old screenshots and logs are automatically deleted to keep the workspace clean.
