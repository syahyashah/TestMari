const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('after:screenshot', (details) => {
        console.log(`Screenshot taken: ${details.path}`);
      });
    },
    //specPattern: "cypress/e2e/**/*.cy.{js,ts}", // Run all Cypress e2e files
    browser: 'chrome', // Set the default browser to Google Chrome
    baseUrl: 'https://dev-ai.stixor.com/', // Set your base URL here
    defaultCommandTimeout: 10000, // Waits up to 10 seconds for commands to resolve
    pageLoadTimeout: 60000, // Waits up to 60 seconds for page loads
    video: false, // Disable video recording
    screenshotOnRunFailure: true, // Capture screenshots on test failures
    trashAssetsBeforeRuns: true, // Clears old screenshots before a new run

    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: true,
      json: true,
    },
  },
});