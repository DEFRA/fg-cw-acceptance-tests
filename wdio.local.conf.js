import allure from 'allure-commandline'
import fs from 'fs'
import path from 'path'
import { browser } from '@wdio/globals'
import resolveUrl from './test/utils/urlResolver.js'
import chromedriver from 'chromedriver'
import { entraLogin } from './test/utils/loginHelper.js'

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
const oneMinute = 60 * 1000
const oneHour = 60 * 60 * 1000

// Log the environment being used
console.log('Environment variables loaded:')
console.log('ENVIRONMENT:', process.env.ENVIRONMENT)
console.log('API_URL:', process.env.API_URL)

export const config = {
  runner: 'local',

  services: [
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
              '--disable-gpu',
              '--window-size=1920,1080'
            ]
          },
          'wdio:chromedriverOptions': {
            binary: chromedriver.path // ✅ use the npm-installed chromedriver
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

  afterStep: async function (step, scenario, result) {
    if (result.error) {
      await browser.takeScreenshot()
    }
  },
  onComplete: function (exitCode, config, capabilities, results) {
    const reportError = new Error('Could not generate Allure report')
    const generation = allure(['generate', 'allure-results', '--clean'])

    return new Promise((resolve, reject) => {
      const generationTimeout = setTimeout(() => reject(reportError), oneMinute)

      generation.on('exit', function (exitCode) {
        clearTimeout(generationTimeout)

        if (exitCode !== 0) {
          return reject(reportError)
        }

        allure(['open'])
        resolve()
      })
    })
  },

  beforeScenario: async function (world, result, context) {
    const scenarioTags = world.pickle.tags.map((t) => t.name)
    browser.url(resolveUrl(scenarioTags))
    browser.options.baseUrl = resolveUrl(scenarioTags)

    const tags = world.pickle.tags.map((t) => t.name)
    console.log(`Running scenario with tags: ${tags.join(', ')}`)

    let username, password

    if (tags.includes('@admin')) {
      username = process.env.ENTRA_ID_ADMIN_USER
      password = process.env.ENTRA_ID_USER_PASSWORD
    } else if (tags.includes('@reader')) {
      username = process.env.ENTRA_ID_READER_USER
      password = process.env.ENTRA_ID_USER_PASSWORD
    } else if (tags.includes('@writer')) {
      username = process.env.ENTRA_ID_WRITER_USER
      password = process.env.ENTRA_ID_USER_PASSWORD
    }

    if (username && password) {
      console.log(`Performing Entra ID login for: ${username}`)
      await entraLogin(username, password)
    } else {
      console.log('No role tag detected — skipping login.')
    }
  },

  afterScenario: async function (world, result, context) {
    await browser.reloadSession()
  }
}
