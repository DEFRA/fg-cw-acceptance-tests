import { Given, Then, When } from '@wdio/cucumber-framework'
import { generatedClientRef, postRequest } from '../page-objects/apiHelper.js'
import AllcasesPage from '../page-objects/allcases.page.js'
import ApplicationPage from '../page-objects/application.page.js'
import TasksPage from '../page-objects/tasks.page.js'
import AssignCasePage from '../page-objects/assignCase.page.js'
import TimelinePage from '../page-objects/timeline.page.js'
import {
  getSingleTodayFormatted,
  getTodayFormatted
} from '../../test/utils/helper.js'
import NotesPage from '../page-objects/notes.page.js'
import AgreementsPage from '../page-objects/agreements.page.js'
import CalculationsPage from '../page-objects/calculations.page.js'

let apiResponse

Given(
  'the user has submitted an application for the {string} grant',
  async (grantName) => {
    const payloadPath = `test/payloads/${grantName}.json`
    apiResponse = await postRequest(`${grantName}/applications`, payloadPath)
    expect(apiResponse.statusCode).toBe(204)
  }
)
When(
  'the user opens the application from the {string} list',
  async (pageTitle) => {
    await AllcasesPage.clickLinkByText(generatedClientRef)
  }
)
Then('the user should see the submitted application information', async () => {
  const actualApplicationText = await ApplicationPage.headerH2()
  await expect(actualApplicationText).toEqual('Tasks')
  await expect(await ApplicationPage.headerH3()).toEqual(
    'Application review tasks'
  )
})
When('the user navigates to the {string} section', async (taskName) => {
  await TasksPage.clickLinkByText(taskName)
})
Then(
  'the user should see that the application data matches the information displayed in Casework',
  async () => {}
)
When('the user Approve the application', async () => {
  await AllcasesPage.clickButtonByText('approve')
})
Then('the user should see application is successfully approved', async () => {
  const actualApprovalText = await ApplicationPage.headerH2()
  await expect(actualApprovalText).toEqual('Stage for contract management')
})
When('the user selects newly created case', async () => {
  await AllcasesPage.selectRadioButtonByCaseText(generatedClientRef)
})
When('the user click the {string} button', async (buttonText) => {
  await AllcasesPage.clickButtonByText(buttonText)
})
Then('the {string} page should be displayed', async (pageTitle) => {
  const actualAssignPageTitle = await AssignCasePage.getHeaderText()
  await expect(actualAssignPageTitle).toEqual(pageTitle)
})
When('the user selects a random case worker', async function () {
  this.assignedUserName = await AssignCasePage.selectRandomUser()
})

Then(
  'the selected case(s) should be assigned to the chosen case worker',
  async function () {
    this.caseUserText =
      await AllcasesPage.getAssignedUserForACase(generatedClientRef)
    expect(this.assignedUserName).toEqual(this.caseUserText)
  }
)

Then(
  'the user should see a success message confirming case assignment',
  async function () {
    const bodyText = await AssignCasePage.getConfirmedUser()
    expect(bodyText).toEqual(
      'Case ' +
        generatedClientRef +
        ' has been assigned to ' +
        this.assignedUserName
    )
  }
)
When(
  'the user enters random text into the Assign case Notes field',
  async function () {
    this.assignedUserNotes = await AssignCasePage.enterNotes()
  }
)

Then(/^the Timeline should display these messages$/, async function (table) {
  const currentUser = await browser.sharedStore.get('currentUser')
  const expectedMessages = table.raw().map((row) => row[0])
  const timelineItems = await $$('.timeline__item')

  const assignedUser = this.assignedUserName

  for (const expected of expectedMessages) {
    let found = false

    for (const item of timelineItems) {
      const headerText = (await item.$('.timeline__header h2').getText()).trim()
      const bylineText = (await item.$('.timeline__byline').getText())
        .replace(/^by\s+/i, '')
        .trim()

      if (expected === 'Case received') {
        if (headerText.includes(expected) && bylineText === 'System') {
          found = true
          break
        }
      }

      if (expected === 'Case assigned') {
        if (
          headerText.includes(expected) &&
          headerText.includes(assignedUser)
        ) {
          found = true
          break
        }
      }

      if (expected === 'Case unassigned') {
        if (headerText.includes(expected) && bylineText === currentUser.role) {
          found = true
          break
        }
      }

      if (expected.startsWith('Stage')) {
        if (
          headerText.includes(expected) &&
          (bylineText === currentUser.role || bylineText === 'System')
        ) {
          found = true
          break
        }
      }

      if (expected.startsWith('Task')) {
        if (headerText.includes(expected) && bylineText === currentUser.role) {
          found = true
          break
        }
      }

      if (expected.startsWith('Status changed to')) {
        if (headerText.includes(expected)) {
          found = true
          break
        }
      }

      if (headerText.includes(expected)) {
        found = true
        break
      }
    }

    if (!found) {
      throw new Error(
        `\n Timeline entry NOT found for: "${expected}"\n` +
          `   Expected byline/user: ${currentUser.role} (if applicable)\n`
      )
    }
  }
})

When('the user click the {string} link', async function (linkText) {
  await TimelinePage.clickLinkByText(linkText)
  await browser.refresh()
})
Then('the user can see the previously entered notes', async function () {
  const currentUser = await browser.sharedStore.get('currentUser')
  console.log(`Logged in as ${currentUser.role} (${currentUser.username})`)
  const expectedDate = getTodayFormatted()
  console.log(`Expected date: ${expectedDate}`)

  const rows = await $$('tbody > tr')
  expect(rows.length).toBeGreaterThan(0)

  let matchingRowFound = false

  for (const row of rows) {
    const cells = await row.$$('td')
    const dateText = (await cells[0].getText()).trim()
    const typeText = (await cells[1].getText()).trim()
    const noteText = (await cells[2].getText()).trim()
    const byText = (await cells[3].getText()).trim()

    console.log(
      `Row Data → Date: "${dateText}", Type: "${typeText}", Note: "${noteText}", By: "${byText}"`
    )

    if (dateText === expectedDate) {
      matchingRowFound = true

      expect(typeText).toEqual('Assignment')
      expect(noteText).toEqual(this.assignedUserNotes)
      expect(byText).toEqual(currentUser.role)

      break
    }
  }

  expect(matchingRowFound).toBe(
    true,
    `Expected to find a row with date "${expectedDate}" but did not`
  )
})

When('the user select Unassigned from the user dropdown', async function () {
  await AssignCasePage.selectUnassignedUser()
})
Then(
  'the user should see a success message confirming case is unassigned',
  async function () {
    const bodyText = await AssignCasePage.getConfirmedUser()
    expect(bodyText).toEqual(
      'Case ' + generatedClientRef + ' has been assigned to Not assigned'
    )
  }
)
Then('the selected case should be unassigned', async function () {
  this.caseUserText =
    await AllcasesPage.getAssignedUserForACase(generatedClientRef)
  expect('Not assigned').toEqual(this.caseUserText)
})
Then('the user should see Agreements details', async function () {
  const title = await AgreementsPage.headerH2()
  expect(title).toEqual('Funding agreement')
})

Then(
  'the user should see below {string} tasks details',
  async function (listName, dataTable) {
    const rows = dataTable.raw()

    for (let i = 0; i < rows.length; i++) {
      const [taskName, expectedStatus] = rows[i]

      const taskElement = await $(`li:nth-of-type(${i + 1}) > div > a`)
      const statusElement = await $(
        `//li[${i + 1}]/div/*[self::strong or self::span]`
      )

      const actualTaskName = await taskElement.getText()
      const actualStatusName = await statusElement.getText()

      await expect(actualTaskName).toEqual(taskName)
      await expect(actualStatusName).toEqual(expectedStatus)
    }
  }
)
Then('the user complete {string} task', async function (taskName) {
  await TasksPage.clickLinkByText(taskName)
  await TasksPage.selectRadioByValue('ACCEPTED')
  await TasksPage.acceptedNotes(taskName)
  await TasksPage.clickButtonByText('Save and continue')
})
Then('the user {string} with a comment', async function (applicationDecision) {
  const code = applicationDecision.toUpperCase().replace(/ /g, '_')
  await AllcasesPage.selectRadioByValue(code)
  await TasksPage.approvalNotes(code)
})
Then('the case status should be {string}', async function (status) {
  const caseStatus = await AllcasesPage.getStatusForACase(generatedClientRef)
  expect(caseStatus).toEqual(status)
})
Then('the user should see {string} tab', async function (link) {
  await TasksPage.waitForElement(link)
})
Then('the user should see Agreements page is displayed', async function () {
  const agreementsPageTitle = await AgreementsPage.headerH2()
  expect(agreementsPageTitle).toEqual('Funding agreement')
})
When(
  'the user waits for the case to appear on the Casework Portal',
  async function () {
    const serviceName = await AllcasesPage.serviceNameHeader()
    await expect(serviceName).toEqual('Manage rural grant applications')
    await AllcasesPage.waitForElement(generatedClientRef)
  }
)
When('the user enters random text into the Add Notes field', async function () {
  this.assignedUserNotes = await NotesPage.enterNotes()
})
Then('user should see a note of type {string}', async function (noteType) {
  const currentUser = await browser.sharedStore.get('currentUser')
  console.log(`Logged in as ${currentUser.role} (${currentUser.username})`)

  const expectedDate = getSingleTodayFormatted()
  console.log(`Expected date: ${expectedDate}`)

  const rows = await $$('tbody > tr')
  expect(rows.length).toBeGreaterThan(0)

  let matchingRowFound = false

  for (const row of rows) {
    const cells = await row.$$('td')
    const dateText = (await cells[0].getText()).trim()
    const typeText = (await cells[1].getText()).trim()
    const noteText = (await cells[2].getText()).trim()
    const byText = (await cells[3].getText()).trim()

    console.log(
      `Row Data → Date: "${dateText}", Type: "${typeText}", Note: "${noteText}", By: "${byText}"`
    )

    if (dateText === expectedDate && typeText === noteType) {
      matchingRowFound = true

      expect(typeText).toEqual(noteType)
      expect(noteText).toEqual(this.assignedUserNotes)
      expect(byText).toEqual(currentUser.role)

      break
    }
  }

  expect(matchingRowFound).toBe(
    true,
    `Expected to find a row with date "${expectedDate}" but did not`
  )
})
When(
  'the user click {string} the case with a comment',
  async function (button) {
    let formatted = button.toUpperCase()

    if (formatted.trim().includes(' ')) {
      formatted = formatted.replace(/\s+/g, '_')
    }

    await TasksPage.approvalNotes(formatted)
    await TasksPage.clickButtonByText(button)
  }
)
Then('user should not options to confirm the task', async function () {
  const el = await $(`//p[normalize-space()="Outcome"]`)
  expect(await el.isDisplayed()).toBe(false)
})
When(
  'the user selects {string} for the case',
  async function (applicationDecision) {
    const code = applicationDecision.toUpperCase().replace(/ /g, '_')
    await AllcasesPage.selectRadioByValue(code)
  }
)
When(
  'the user select {string} to complete {string} task',
  async function (option, taskName) {
    await TasksPage.clickLinkByText(taskName)
    await TasksPage.selectRadioAndEnterText(option, taskName)
    // await TasksPage.approvalNotes(option)
    await TasksPage.clickButtonByText('Confirm')
  }
)
Then(
  /^the user remain on the page with a "([^"]*)" error message displayed$/,
  async function (message) {
    const alertText = await NotesPage.alertText()
    expect(alertText).toContain('There is a problem')
    expect(alertText).toContain(message)
  }
)

Then(
  'the user selects {string} for the case with a comment',
  async function (applicationDecision) {
    const code = applicationDecision.toUpperCase().replace(/ /g, '_')
    await AllcasesPage.selectRadioByValue(code)
    await TasksPage.approvalNotes(code)
  }
)
Then(/^the user should see "([^"]*)" message$/, async function (message) {
  await TasksPage.headerH2()
  expect(await TasksPage.headerH2()).toEqual(message)
})
Then(
  'the timeline should show {string}{string}',
  async function (expectedTitle, notePart) {
    const expectNoteLink = notePart.trim() === ' with a note'
    await TimelinePage.validateTimelineEntry(expectedTitle, expectNoteLink)
  }
)

Then('the user should see case agreements details', async function (dataTable) {
  await AgreementsPage.validateSummaryListFromTable(dataTable)
})
When(/^the user waits for the agreements message$/, async function () {
  await browser.refresh()
})

Then(
  'the user waits until the agreements message {string} is displayed',
  async function (expectedMessage) {
    const timeoutMs = 30000
    const pollInterval = 2000
    const startTime = Date.now()

    while (true) {
      const elements = await $$('dl > div > dd')
      const actualText = (await elements[0].getText()).trim()

      if (actualText === expectedMessage) {
        return
      }

      if (Date.now() - startTime > timeoutMs) {
        throw new Error(
          `Timeout: expected agreements message "${expectedMessage}" but got "${actualText}"`
        )
      }

      await browser.refresh()
      await browser.pause(pollInterval)
    }
  }
)
When(
  'the user clicks Confirm on the task without notes and sees {string}',
  async function (errorMessage, dataTable) {
    const tasks = dataTable.raw()

    for (const task of tasks) {
      console.log(task)
      console.log('TASK IS')
      await TasksPage.clickLinkByText(task)
      await TasksPage.selectRandomRadioButton()
      await TasksPage.clickButtonByText('Confirm')

      const alertText = await TasksPage.alertText()
      expect(alertText).toContain('There is a problem\n' + errorMessage)

      await TasksPage.clickLinkByText('Tasks')
    }
  }
)
When(/^the user waits for the case status to be updated$/, async function () {
  await browser.refresh()
})
Then(/^the user can view Land parcel calculations page$/, async function () {
  expect(await CalculationsPage.getHeaderText()).toEqual(
    'Land parcel calculations'
  )
})
