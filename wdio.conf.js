import fs from 'node:fs'
import { browser } from '@wdio/globals'
import { analyse, getHtmlReportByCategory, init } from './dist/wcagchecker.cjs'

import { resolveUrl } from './test/utils/urlResolver.js'
import { entraLogin } from './test/utils/loginHelper.js'
import { execSync } from 'node:child_process'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

const alreadyAnalysed = []

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

export const config = {
  runner: 'local',

  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cases`,
  gasUrl: `https://fg-gas-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/grants/`,

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
  before: async function (capabilities, specs) {
    await browser.url('about:blank')
    if (isAccessibilityRun) {
      await init()
    }
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

  /**
   * Hook that gets executed after the suite has ended
   * @param {object} suite suite details
   */
  // afterSuite: function (suite) {},
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  afterCommand: async function (commandName, args, result, error) {
    if (commandName !== 'deleteSession' && isAccessibilityRun) {
      const actualUrl = await browser.getUrl()

      if (
        actualUrl !== 'about:blank' &&
        !/microsoft|ete\.access/.test(actualUrl)
      ) {
        const url = new URL(actualUrl)
        const formattedUrl = `${url.origin}${url.pathname}`

        if (!alreadyAnalysed.includes(formattedUrl)) {
          alreadyAnalysed.push(formattedUrl)
          await analyse(browser, '')
        }
      }
    }
  },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  after: function (result, capabilities, specs) {
    console.log('in the after hook=======================')

    if (isAccessibilityRun) {
      fs.writeFileSync(
        `./reports/accessibility/report-${Date.now()}.html`,
        getHtmlReportByCategory().replace(
          /<script>, <template> or <div> /g,
          'script, template or div '
        )
      )
    }
  },

  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {},
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param world
   */

  beforeScenario: async function (world, result, context) {
    const scenarioTags = world.pickle.tags.map((t) => t.name)
    await browser.url(resolveUrl(scenarioTags))
    browser.options.baseUrl = resolveUrl(scenarioTags)

    const tags = world.pickle.tags.map((t) => t.name)
    console.log(
      `RUNNING: ${world.pickle.name} | ${world.pickle.tags.map((t) => t.name).join(',')}`
    )

    console.log(
      `🎯 Running scenario: "${world.pickle.name}" | tags: ${tags.join(', ')}`
    )

    let username, password, role

    if (tags.includes('@admin')) {
      username = process.env.ENTRA_ID_ADMIN_USER
      password = process.env.ENTRA_ID_USER_PASSWORD
      role = 'SA-FGCW ADMIN (Equal Experts)'
    } else if (tags.includes('@reader')) {
      username = process.env.ENTRA_ID_READER_USER
      password = process.env.ENTRA_ID_USER_PASSWORD
      role = 'fgcw reader (Equal Experts)'
    } else if (tags.includes('@writer')) {
      username = process.env.ENTRA_ID_WRITER_USER
      password = process.env.ENTRA_ID_USER_PASSWORD
      role = 'SA-FGCW WRITER (Equal Experts)'
    }

    await browser.sharedStore.set('currentUser', { username, role })

    if (username && password) {
      console.log(`Performing Entra ID login for: ${username}`)
      await entraLogin(username, password)
    } else {
      console.log('No role tag detected — skipping login.')
    }
  },

  afterStep: async function (step, scenario, result) {
    if (result.error) {
      await browser.takeScreenshot()
    }
  },

  afterScenario: async function (world, result, context) {
    await browser.reloadSession()
  },

  onComplete: function (exitCode, config, capabilities, results) {
    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
