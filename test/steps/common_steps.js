import { Given, When } from '@wdio/cucumber-framework'
import AdminPage from '../page-objects/admin.page.js'

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
