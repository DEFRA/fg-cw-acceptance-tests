import { When, Then } from '@wdio/cucumber-framework'
import { getGpaUrl } from '../support/serviceUrls.js'
import applicationPage from '../page-objects/application.page.js'
import grantsPlatformAdminPage from '../page-objects/grants.platform.admin.page.js'

When(/^the user navigate to GPA as a writer$/, async function () {
  const url = getGpaUrl(this.generatedClientRef)
  browser.options.baseUrl = url
  console.log('URL IS: ' + url)
  await browser.url(url)
})
When(/^the enters the claim amount$/, async function () {
  const totalHectares = await $('[data-testid="claimable-field-totalHectares"]')

  await totalHectares.setValue('25')
})
Then(/^the user should see claim confirmation message$/, async function () {
  expect(await applicationPage.headerH3()).toEqual('Claimable item created')
})
Then(
  /^the user create WMP entitlement claim for (\d+) ha$/,
  async function (totalHectares) {
    await grantsPlatformAdminPage.clickCreateClaim()
    await grantsPlatformAdminPage.enterText('#totalHectares', totalHectares)
    await grantsPlatformAdminPage.clickButtonByText('Save item')
    const cliamConfirmation = await grantsPlatformAdminPage.headerH3()
    expect(await cliamConfirmation).toEqual('Claimable item created')
  }
)
