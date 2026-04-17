import fs from 'node:fs'
import { browser } from '@wdio/globals'
import allureReporter from '@wdio/allure-reporter'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

const profile =
  process.env.PROFILE ||
  process.env.CDP_PROFILE ||
  process.env.TEST_PROFILE ||
  ''

if (profile === 'accessibility' && !process.env.SELECTED_TAGS) {
  process.env.SELECTED_TAGS = '@accessibility'
}

const tagExpression = process.env.SELECTED_TAGS || '@cw'
console.log('[CDP tags/profile]', {
  PROFILE: process.env.PROFILE,
  CDP_PROFILE: process.env.CDP_PROFILE,
  TEST_PROFILE: process.env.TEST_PROFILE,
  SELECTED_TAGS: process.env.SELECTED_TAGS,
  tagExpression
})

export const config = {
  runner: 'local',
  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cases`,
  gasUrl: `https://fg-gas-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/grants/`,
  // gasUrl: `https://ephemeral-protected.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/fg-gas-backend/grants/`,

  hostname: process.env.CHROMEDRIVER_URL || '127.0.0.1',
  port: process.env.CHROMEDRIVER_PORT || 4444,

  specs: ['./test/features/**/*.feature'],
  exclude: [],
  maxInstances: 5,

  services: ['shared-store'],

  capabilities: [
    {
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

  bail: 0,
  waitforTimeout: 10000,
  waitforInterval: 200,
  connectionRetryTimeout: 60000,
  connectionRetryCount: 1,
  framework: 'cucumber',

  reporters: [
    [
      'spec',
      {
        addConsoleLogs: true,
        realtimeReporting: true,
        color: false
      }
    ],
    [
      'allure',
      {
        outputDir: 'allure-results',
        useCucumberStepReporter: true
      }
    ]
  ],

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

  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 60000,
    bail: true
  },

  afterTest: async function (test, context, { error }) {
    if (error) {
      try {
        const screenshot = await browser.takeScreenshot()

        allureReporter.addAttachment(
          `Failure Screenshot - ${test?.title || 'test'}`,
          Buffer.from(screenshot, 'base64'),
          'image/png'
        )
      } catch (e) {
        console.log(`Could not capture afterTest screenshot: ${e.message}`)
      }
    }
  },

  after: function () {
    console.log('in the after hook=======================')
  },

  afterStep: async function (step, scenario, result) {
    if (!result.passed) {
      try {
        const screenshot = await browser.takeScreenshot()

        allureReporter.addAttachment(
          `Failure Screenshot - ${step.text || 'step'}`,
          Buffer.from(screenshot, 'base64'),
          'image/png'
        )
      } catch (e) {
        console.log(`Could not capture afterStep screenshot: ${e.message}`)
      }
    }
  },

  afterScenario: async function () {
    try {
      await browser.sharedStore.set('currentUser', null)
    } catch (e) {
      console.log(`Could not clear currentUser from sharedStore: ${e.message}`)
    }
  },

  onComplete: function (exitCode, config, capabilities, results) {
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
