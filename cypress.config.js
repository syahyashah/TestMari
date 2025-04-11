const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const { startDevServer } = require("@cypress/webpack-dev-server");
const webpackConfig = require("./webpack.config.js"); // Make sure this file exists or adjust accordingly

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const logFilePath = path.join(__dirname, "cypress/logs/test-log.txt");
      const screenshotsFolder = path.join(__dirname, "cypress/screenshots");

      if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
      }

      if (!fs.existsSync(screenshotsFolder)) {
        fs.mkdirSync(screenshotsFolder, { recursive: true });
      }

      fs.writeFileSync(logFilePath, "Test Execution Log\n\n", { flag: "w" });

      if (fs.existsSync(screenshotsFolder)) {
        fs.readdirSync(screenshotsFolder).forEach(file => {
          try {
            fs.unlinkSync(path.join(screenshotsFolder, file));
          } catch (err) {
            console.error(`Failed to delete ${file}: ${err.message}`);
          }
        });
      }

      on("after:screenshot", (details) => {
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const newPath = path.join(screenshotsFolder, `${timestamp}-${path.basename(details.path)}`);
        fs.renameSync(details.path, newPath);
        console.log(`Screenshot saved: ${newPath}`);
        fs.appendFileSync(logFilePath, `Screenshot saved: ${newPath}\n`);
      });

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

    screenshotsFolder: "cypress/screenshots",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig,
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
  },

  env: {
    apiUrl: "https://dev-ai.stixor.com/api",
  },
});
