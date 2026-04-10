import fs from 'fs'
import { browser } from '@wdio/globals'
import chromedriver from 'chromedriver'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file manually
try {
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  }
} catch (error) {
  console.warn('Could not load .env file:', error.message)
}

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

// Log the environment being used
console.log('Environment variables loaded:')
console.log('ENVIRONMENT:', process.env.ENVIRONMENT)
console.log('API_URL:', process.env.API_URL)

export const config = {
  runner: 'local',
  gasUrl: `https://ephemeral-protected.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/fg-gas-backend/grants/`,
  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT || 'dev'}.cdp-int.defra.cloud`,

  services: [
    'shared-store',
    ['chromedriver', { port: 9515 }] // service starts/stops Chromedriver for you
  ],

  path: '/',
  specs: ['./test/features/**/*.feature'],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  maxInstances: 1,

  capabilities: debug
    ? [{ browserName: 'chrome' }]
    : [
        {
          maxInstances: 1,
          browserName: 'chrome',
          'goog:chromeOptions': {
            binary:
              '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // ✅ quote path
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
          },
          'wdio:chromedriverOptions': {
            binary: chromedriver.path
          }
        }
      ],

  execArgv: debug ? ['--inspect'] : [],

  //
  // ===================
  // Test Configurations
  // ===================

  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: debug ? 'debug' : 'info',
  bail: 1,
  waitforTimeout: 10000,
  waitforInterval: 200,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,

  framework: 'cucumber',

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        disableMochaHooks: true,
        useCucumberStepReporter: true
      }
    ]
  ],

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

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 60000
  },

  beforeScenario: async function () {
    console.log('Started before scenario.....')
  },

  afterStep: async function (step, scenario, result) {
    if (result.error) {
      await browser.takeScreenshot()
    }
  },

  onComplete: function () {
    const reportError = new Error('Could not generate Allure report')
    const resultsDir = path.resolve(__dirname, 'allure-results')
    const command = `npx allure generate "${resultsDir}" --clean && npx allure open`

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr)
          return reject(reportError)
        }
        console.log(stdout)
        console.log('Allure report generated and opened successfully.')
        resolve()
      })
    })
  },

  afterScenario: async function (world, result, context) {
    await browser.reloadSession()
    await browser.sharedStore.set('currentUser', null)
  }
}
