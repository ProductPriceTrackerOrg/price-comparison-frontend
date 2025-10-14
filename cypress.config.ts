import { defineConfig } from "cypress";

export default defineConfig({
  // 1. Tell Cypress to use the reporter
  reporter: "cypress-mochawesome-reporter",

  // 2. Configure the reporter's options
  reporterOptions: {
    charts: true,
    reportPageTitle: "PricePulse E2E Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // 3. This is the crucial line that loads the plugin
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
