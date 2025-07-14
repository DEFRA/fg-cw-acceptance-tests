import fs from 'node:fs'
// import { ProxyAgent, setGlobalDispatcher } from 'undici'
// import { bootstrap } from 'global-agent'

/**
 * Enable webdriver.io to use the outbound proxy.
 * This is required for the test suite to be able to talk to BrowserStack.
 */
// if (process.env.HTTP_PROXY) {
//   const dispatcher = new ProxyAgent({
//     uri: process.env.HTTP_PROXY
//   })
//   setGlobalDispatcher(dispatcher)
//   bootstrap()
//   global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
// }

// const oneMinute = 60 * 1000

export const config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO supports running e2e tests as well as unit and component tests.
  runner: 'local',
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,
  gasUrl: `https://fg-gas-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/grants/`,

  // You will need to provide your own BrowserStack credentials.
  // These should be added as secrets to the test suite.
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_KEY,

  // Tests to run
  specs: ['./test/features/**/*.feature'],
  // Tests to exclude
  exclude: [],
  maxInstances: 5,

  commonCapabilities: {
    'bstack:options': {
      buildName: `fg-cw-acceptance-tests-${process.env.ENVIRONMENT}` // configure as required
    }
  },

  capabilities: [
    {
      browserName: 'Chrome', // Set as required
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      }
    }
  ],

  services: [
    [
      'browserstack',
      {
        testObservability: true, // Disable if you do not want to use the browserstack test observer functionality
        testObservabilityOptions: {
          user: process.env.BROWSERSTACK_USERNAME,
          key: process.env.BROWSERSTACK_KEY,
          projectName: 'cdp-node-env-test-suite', // should match project in browserstack
          buildName: `fg-cw-acceptance-tests-${process.env.ENVIRONMENT}`
        },
        acceptInsecureCerts: true,
        forceLocal: false,
        browserstackLocal: false
        // opts: {
        //   proxyHost: 'localhost',
        //   proxyPort: 3128
        // }
      }
    ]
  ],

  execArgv: ['--loader', 'esm-module-alias/loader'],

  logLevel: 'info',

  // Number of failures before the test suite bails.
  bail: 0,
  waitforTimeout: 10000,
  waitforInterval: 200,
  connectionRetryTimeout: 6000,
  connectionRetryCount: 3,

  framework: 'cucumber',

  reporters: [
    [
      // Spec reporter provides rolling output to the logger so you can see it in-progress
      'spec',
      {
        addConsoleLogs: true,
        realtimeReporting: true,
        color: false
      }
    ],
    [
      // Allure is used to generate the final HTML report
      'allure',
      {
        outputDir: 'allure-results'
      }
    ]
  ],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  cucumberOpts: {
    // <string[]> (file/dir) require files before executing features
    require: ['./test/steps/*.js'],
    // <boolean> show full backtrace for errors
    backtrace: false,
    // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    requireModule: [],
    // <boolean> invoke formatters without executing steps
    dryRun: false,
    // <boolean> abort the run on first failure
    failFast: false,
    // <string[]> Only execute the scenarios with name matching the expression (repeatable).
    name: [],
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <boolean> fail if there are any undefined or pending steps
    strict: false,
    // <string> (expression) only execute the features or scenarios with tags matching the expression
    tagExpression: '',
    // <number> timeout for step definitions
    timeout: 120000,
    // <boolean> Enable this config to treat undefined definitions as warnings.
    ignoreUndefinedDefinitions: false
  },

  // mochaOpts: {
  //   ui: 'bdd',
  //   timeout: oneMinute
  // },

  // Hooks
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (error) {
      await browser.takeScreenshot()
    }
  },

  onComplete: function (exitCode, config, capabilities, results) {
    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
