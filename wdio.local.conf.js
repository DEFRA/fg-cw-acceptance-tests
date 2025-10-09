import fs from 'fs'
import { browser } from '@wdio/globals'
import resolveUrl from './test/utils/urlResolver.js'
import { entraLogin } from './test/utils/loginHelper.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

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

// Fix for ESM environments (since __dirname is undefined)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = process.env.DEBUG

// Log the environment being used
console.log('Environment variables loaded:')
console.log('ENVIRONMENT:', process.env.ENVIRONMENT)
console.log('API_URL:', process.env.API_URL)

export const config = {
  runner: 'local',

  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cases`,
  gasUrl: `https://fg-gas-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/grants/`,

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--no-sandbox',
          '--headless=new',
          '--disable-infobars',
          '--disable-gpu',
          '--window-size=1920,1080'
        ]
      }
    }
  ],
  specs: ['./test/features/**/*.feature'],
  exclude: [],
  maxInstances: 1,

  execArgv: debug ? ['--inspect'] : [],
  logLevel: debug ? 'debug' : 'info',
  bail: 1,
  waitforTimeout: 10000,
  waitforInterval: 200,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  reporters: [
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
    require: ['./test/steps/*.js'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 180000,
    ignoreUndefinedDefinitions: false
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
