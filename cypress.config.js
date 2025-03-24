const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Define log file path
      const logFilePath = path.join(__dirname, "cypress/logs/test-log.txt");
      const screenshotsFolder = path.join(__dirname, "cypress/screenshots");

      // Ensure log directory exists
      if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
      }

      // Ensure screenshots directory exists
      if (!fs.existsSync(screenshotsFolder)) {
        fs.mkdirSync(screenshotsFolder, { recursive: true });
      }

      // Clear log file before each run
      fs.writeFileSync(logFilePath, "Test Execution Log\n\n", { flag: "w" });

      // Delete previous screenshots before each run
      if (fs.existsSync(screenshotsFolder)) {
        fs.readdirSync(screenshotsFolder).forEach(file => {
          fs.unlinkSync(path.join(screenshotsFolder, file));
        });
      }

      // Node event for screenshots
      on("after:screenshot", (details) => {
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const newPath = path.join(screenshotsFolder, `${timestamp}-${path.basename(details.path)}`);

        // Rename and move the screenshot with a timestamp
        fs.renameSync(details.path, newPath);

        console.log(`Screenshot saved: ${newPath}`);
        fs.appendFileSync(logFilePath, `Screenshot saved: ${newPath}\n`);
      });

      // Custom logging task
      on("task", {
        logToFile(message) {
          const logEntry = `${new Date().toISOString()} - ${message}\n`;
          fs.appendFileSync(logFilePath, logEntry);
          console.log(message);
          return null;
        },
      });

      return config;
    },

    browser: "chrome",
    baseUrl: "https://dev-ai.stixor.com/",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    retries: 2,
    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,

    reporter: "mochawesome",
    reporterOptions: {
      reportDir: `cypress/reports/${new Date().toISOString().replace(/:/g, "-")}`,
      overwrite: false,
      html: true,
      json: true,
    },

    screenshotsFolder: "cypress/screenshots", // Define custom screenshot folder
  },

  env: {
    apiUrl: "https://dev-ai.stixor.com/api",
  },
});