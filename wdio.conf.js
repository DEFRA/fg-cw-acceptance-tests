import fs from 'node:fs'
import { browser } from '@wdio/globals'
import { analyse, getHtmlReportByCategory, init } from './dist/wcagchecker.cjs'

import resolveUrl from './test/utils/urlResolver.js'
import { entraLogin } from './test/utils/loginHelper.js'

const debug = process.env.DEBUG

const alreadyAnalysed = []

export const config = {
  runner: 'local',

  baseUrl: `https://fg-cw-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cases`,
  gasUrl: `https://fg-gas-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/grants/`,

  // Connection to remote chromedriver
  hostname: process.env.CHROMEDRIVER_URL || 'localhost',
  port: process.env.CHROMEDRIVER_PORT || 4444,

  // Tests to run
  specs: ['./test/features/**/*.feature'],
  // Tests to exclude
  exclude: [],
  maxInstances: debug ? 1 : 5,

  capabilities: [
    {
      ...(process.env.HTTP_PROXY && {
        proxy: {
          proxyType: 'manual',
          httpProxy: new URL(process.env.HTTP_PROXY).host,
          sslProxy: new URL(process.env.HTTP_PROXY).host
        }
      }),
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
  connectionRetryTimeout: 6000,
  connectionRetryCount: 3,
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
    tagExpression: '',
    timeout: 180000,
    ignoreUndefinedDefinitions: false
  },

  before: async function (capabilities, specs) {
    await browser.url('about:blank')
    process.env.SELECTED_TAGS === '@accessibility' && (await init())
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

  afterCommand: async function (commandName, args, result, error) {
    if (
      commandName !== 'deleteSession' &&
      process.env.SELECTED_TAGS === '@accessibility'
    ) {
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

  after: function (result, capabilities, specs) {
    console.log('in the after hook=======================')

    process.env.SELECTED_TAGS === '@accessibility' &&
      fs.writeFileSync(
        `./reports/accessibility/report-${Date.now()}.html`,
        getHtmlReportByCategory().replace(
          /<script>, <template> or <div> /g,
          'script, template or div '
        )
      )
  },

  beforeScenario: async function (world, result, context) {
    const scenarioTags = world.pickle.tags.map((t) => t.name)
    browser.url(resolveUrl(scenarioTags))
    browser.options.baseUrl = resolveUrl(scenarioTags)

    const tags = world.pickle.tags.map((t) => t.name)
    console.log(`🎯 Running scenario with tags: ${tags.join(', ')}`)

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
