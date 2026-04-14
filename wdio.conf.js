import fs from 'node:fs'
import { browser } from '@wdio/globals'
import allure from 'allure-commandline'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

// ---- Run mode (CDP profile -> tag selection) ----
const profile =
  process.env.PROFILE ||
  process.env.CDP_PROFILE ||
  process.env.TEST_PROFILE ||
  ''

// If CDP provides a profile value, translate it into your existing tag mechanism
if (profile === 'accessibility' && !process.env.SELECTED_TAGS) {
  process.env.SELECTED_TAGS = '@accessibility'
}

// Default: functional tests
const tagExpression = process.env.SELECTED_TAGS || '@cw'
console.log('[CDP tags/profile]', {
  PROFILE: process.env.PROFILE,
  CDP_PROFILE: process.env.CDP_PROFILE,
  TEST_PROFILE: process.env.TEST_PROFILE,
  SELECTED_TAGS: process.env.SELECTED_TAGS,
  tagExpression
})

// Robust flag for hooks/reporting
const isAccessibilityRun = tagExpression.includes('@accessibility')

// Optional: TEMP debug (remove once confirmed in CDP logs)
// console.log('[CDP] profile/tagExpression', { profile, tagExpression })
// let inA11yAfterCommand = false

export const config = {
  runner: 'local',

  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cases`,
  gasUrl: `https://fg-gas-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/grants/`,
  // gasUrl: `https://ephemeral-protected.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/fg-gas-backend/grants/`,

  // Connection to remote chromedriver
  hostname: process.env.CHROMEDRIVER_URL || '127.0.0.1',
  port: process.env.CHROMEDRIVER_PORT || 4444,

  // Tests to run
  specs: ['./test/features/**/*.feature'],
  // Tests to exclude
  exclude: [],
  maxInstances: debug ? 1 : 5,

  services: ['shared-store'],

  capabilities: [
    {
      // Outbound calls must go via the proxy
      proxy: {
        proxyType: 'manual',
        httpProxy: 'localhost:3128',
        sslProxy: 'localhost:3128'
      },
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--no-sandbox',
          '--disable-infobars',
          '--headless',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--password-store=basic',
          '--use-mock-keychain',
          '--dns-prefetch-disable',
          '--disable-background-networking',
          '--disable-remote-fonts',
          '--ignore-certificate-errors',
          '--disable-dev-shm-usage'
        ]
      }
    }
  ],

  execArgv: debug ? ['--inspect'] : [],

  logLevel: debug ? 'debug' : 'info',

  // Number of failures before the test suite bails.
  bail: 0,
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  waitforInterval: 200,
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send resp
  connectionRetryTimeout: 60000,
  connectionRetryCount: 1,
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
        outputDir: 'allure-results',
        useCucumberStepReporter: true
      }
    ]
  ],
  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    require: ['./test/steps/*.js'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: false,
    tagExpression,
    timeout: 180000,
    ignoreUndefinedDefinitions: false
  },
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 60000,
    bail: true
  },

  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (error) {
      await browser.takeScreenshot()
    }
  },

  after: function (result, capabilities, specs) {
    console.log('in the after hook=======================')
  },

  afterStep: async function (step, scenario, result) {
    if (!result.passed) {
      const screenshot = await browser.takeScreenshot()

      allure.addAttachment(
        `Failure Screenshot - ${step.text || 'step'}`,
        Buffer.from(screenshot, 'base64'),
        'image/png'
      )
    }
  },

  afterScenario: async function (world, result, context) {
    if (isAccessibilityRun) return // DO NOT reload sessions during a11y collection
    await browser.reloadSession()
  },

  onComplete: function (exitCode, config, capabilities, results) {
    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
