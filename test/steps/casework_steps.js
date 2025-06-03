import { Given, Then, When } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import { generatedClientRef, postRequest } from '../page-objects/apiHelper.js'
import AllcasesPage from '../page-objects/allcases.page.js'
import ApplicationPage from '../page-objects/application.page.js'
import TasksPage from '../page-objects/tasks.page.js'

let apiResponse
Given('the user is navigate to {string} page', async (text) => {
  await browser.url(text)
  await AllcasesPage.clickLinkByText('All Cases')
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
    // console.log('Now searching for clientRef:', generatedClientRef)

    const actualAllCasesText = await AllcasesPage.headerH2()
    await expect(actualAllCasesText).toEqual(pageTitle)
    await AllcasesPage.clickLinkByText(generatedClientRef)
  }
)
Then('the user should see the submitted application information', async () => {
  const actualApplicationText = await ApplicationPage.headerH2()
  await expect(actualApplicationText).toEqual('Application Receipt')
})
When('the user navigates to the Case Details section', async () => {
  await TasksPage.clickLinkByText('Case Details')
})
Then(
  'the user should see that the application data matches the information displayed in Casework',
  async () => {}
)
When('the user Approve the application', async () => {
  await AllcasesPage.clickButtonByText('Approve')
})
Then('the user should see application is successfully approved', async () => {
  const actualApprovalText = await ApplicationPage.headerH2()
  await expect(actualApprovalText).toEqual('Stage for contract management')
})
