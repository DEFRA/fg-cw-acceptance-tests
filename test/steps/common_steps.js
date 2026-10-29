import { Given, When, Then } from '@wdio/cucumber-framework'
import AdminPage from '../page-objects/admin.page.js'
import { loginToCaseworking } from '../support/loginHelper.js'
import { loginAndRunWoodlandManagementJourney } from '../page-objects/grant-ui/woodland-journey-helper.js'
import { clearState } from 'page-objects/grant-ui/clear-sbi-state.js'

When('the user opens the {string} page', async function (linkText) {
  await AdminPage.clickLinkByText(linkText)
})
// need better way to handle this..
Given(/^the user refresh the browser$/, async function () {
  for (let i = 0; i < 5; i++) {
    await browser.refresh()
    await browser.waitUntil(
      async () =>
        (await browser.execute(() => document.readyState)) === 'complete',
      {
        timeout: 10000,
        timeoutMsg: 'Page did not finish loading after refresh'
      }
    )
  }
})
Given(
  /^the user signed into Caseworking with read permission$/,
  async function () {
    await loginToCaseworking('reader')
  }
)
Then(
  /^the user should be shown a permission denied message$/,
  async function () {
    const isDisplayed = await AdminPage.isExactPermissionMessageDisplayed()
    await expect(isDisplayed).toBe(true)
  }
)
Given(
  /^the user signed into Caseworking with admin permission$/,
  async function () {
    await loginToCaseworking('admin')
  }
)
Given(/^the user submit the application using grants ui$/, async function () {
  const testUser = {
    username: '1234454565',
    password: process.env.DEFRA_ID_USER_PASSWORD
  }

  const woodlandApplicationData = {
    landParcelId: 'ST1437-7349',
    hectaresTenOrOverYearsOld: 30,
    centreGridReference: 'SP 4178 2432',
    woodlandName: 'Ashbrook WD',
    fcTeamCodeId: 'fcTeamCode-2'
  }

  const { username, password } = testUser

  // Clear application state
  const sbi = '106841262'
  await clearState(username, sbi, 'woodland')
  console.log('Woodland application state cleared')

  // Complete the woodland application journey via the UI
  const { appRefNum } = await loginAndRunWoodlandManagementJourney({
    username,
    password,
    applicationData: woodlandApplicationData
  })

  console.log(appRefNum)

  this.generatedClientRef = appRefNum

  console.log('App Ref Num: ' + appRefNum)
})
