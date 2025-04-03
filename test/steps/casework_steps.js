import { Given, Then } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import HomePage from '../page-objects/home.page.js'

Given(/^the user is navigate to ([^"]*)? page$/, async (text) => {
  await browser.url(text)
  const actualApplicationText = await HomePage.header()
  await expect(actualApplicationText).toEqual('Applications')

  await HomePage.clickLinkByText()
  const actualText = await HomePage.headerH2()
  await expect(actualText).toEqual('All cases')
})
Then(/^user should see all the cases assigned$/, async () => {
  const rowCount = await HomePage.allCases()
  await expect(rowCount).toEqual(2)
})
