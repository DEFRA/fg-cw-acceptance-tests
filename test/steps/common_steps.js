import { Given, When, Then } from '@wdio/cucumber-framework'
import AdminPage from '../page-objects/admin.page.js'
import { loginToCaseworking } from '../support/loginHelper.js'

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
