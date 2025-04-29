import { Given, Then, When } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import { generatedClientRef, postRequest } from '../page-objects/apiHelper.js'
import AllcasesPage from '../page-objects/allcases.page.js'
import ApplicationPage from '../page-objects/application.page.js'

let apiResponse
Given(/^user is navigate to ([^"]*)? page$/, async (text) => {
  await browser.url(text)
  const actualApplicationText = await AllcasesPage.getHeaderText()
  await expect(actualApplicationText).toEqual('Applications')
  await AllcasesPage.clickLinkByText('All Cases')

  const actualAllCasesText = await AllcasesPage.headerH2()
  await expect(actualAllCasesText).toEqual('All cases')
})

Given('user submitted a application for {string} grant', async (grantName) => {
  const payloadPath = `test/payloads/${grantName}.json`
  apiResponse = await postRequest(`${grantName}/applications`, payloadPath)
  return apiResponse
})
When(/^user open the application from All cases$/, async () => {
  // console.log('Now searching for clientRef:', generatedClientRef)
  await AllcasesPage.clickLinkByText(generatedClientRef)
})
Then(/^user should the application information$/, async () => {
  const actualApplicationText = await ApplicationPage.getHeaderText()
  await expect(actualApplicationText).toEqual('Application')
})
