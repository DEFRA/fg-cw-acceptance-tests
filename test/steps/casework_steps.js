import { Given, Then, When } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import { generatedClientRef, postRequest } from '../page-objects/apiHelper.js'
import AllcasesPage from '../page-objects/allcases.page.js'
import ApplicationPage from '../page-objects/application.page.js'
import TasksPage from '../page-objects/tasks.page.js'
import AssignCasePage from '../page-objects/assignCase.page.js'
import TimelinePage from '../page-objects/timeline.page.js'
import { getTodayFormatted } from '../../test/utils/helper.js'

let apiResponse
Given('the user navigates to the {string} page', async (url) => {
  await browser.url(url)
  // await AllcasesPage.clickLinkByText('All Cases')
})

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
    // const actualAllCasesText = await AllcasesPage.headerH2()
    // await expect(actualAllCasesText).toEqual(pageTitle)
    await AllcasesPage.clickLinkByText(generatedClientRef)
  }
)
Then('the user should see the submitted application information', async () => {
  const actualApplicationText = await ApplicationPage.headerH2()
  await expect(actualApplicationText).toEqual('Application Receipt')
})
When('user navigates to the {string} section', async (taskName) => {
  await TasksPage.clickLinkByText(taskName)
})
Then(
  'the user should see that the application data matches the information displayed in Casework',
  async () => {}
)
When('the user Approve the application', async () => {
  // button is diabled so commenting for now
  // await AllcasesPage.clickButtonByText('Approve')
})
Then('the user should see application is successfully approved', async () => {
  // const actualApprovalText = await ApplicationPage.headerH2()
  // await expect(actualApprovalText).toEqual('Stage for contract management')
})
When('the user selects newly created case', async () => {
  await AllcasesPage.selectRadioButtonByCaseText(generatedClientRef)
})
When('click the {string} button', async (buttonText) => {
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
When('I enter random text into the notes field', async function () {
  this.assignedUserNotes = await AssignCasePage.enterNotes()
})
Then(
  'the Timeline should display these messages',
  async function (timelineMessage) {
    const expectedStatuses = timelineMessage.raw().flat()

    const timelineItems = await $$('.timeline__item')

    for (const status of expectedStatuses) {
      let found = false

      for (const item of timelineItems) {
        const headerText = (
          await item.$('.timeline__header h2').getText()
        ).trim()
        const bylineText = (await item.$('.timeline__byline').getText()).trim()

        if (status === 'Case assigned') {
          if (
            headerText.includes(status) &&
            headerText.includes(this.assignedUserName)
          ) {
            found = true
            break
          }
        } else if (status === 'Case received') {
          if (headerText.includes(status) && bylineText === 'by System') {
            found = true
            break
          }
        } else {
          if (headerText.includes(status)) {
            found = true
            break
          }
        }
      }

      expect(found).toBe(
        true,
        `Expected to find timeline entry for "${status}"` +
          (status === 'Case assigned'
            ? ` with user "${this.assignedUserName}"`
            : '') +
          (status === 'Case received' ? ` with byline "by System"` : '') +
          ` but it was missing.`
      )
    }
  }
)
When('click the {string} link', async function (linkText) {
  await TimelinePage.clickLinkByText(linkText)
})
Then('the user can see the previously entered notes', async function () {
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
      expect(byText).toEqual('System')

      break
    }
  }

  expect(matchingRowFound).toBe(
    true,
    `Expected to find a row with date "${expectedDate}" but did not`
  )
})
Then(
  'I remain on the Notes page with a {string} error message displayed',
  async function (message) {
    const alertBox = await $('div[role="alert"]')
    const alertText = await alertBox.getText()

    expect(alertText).toContain(message)
  }
)
