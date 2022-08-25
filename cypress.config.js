const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      baseUrl: 'http://localhost:3000',
      watchForFileChanges: false,
      numTestsKeptInMemory: 50,
      specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
      retries: {
        runMode: 1,
        openMode: 0,
      },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
