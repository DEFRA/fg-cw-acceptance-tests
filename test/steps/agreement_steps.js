import { When } from '@wdio/cucumber-framework'
import { loginToAgreement } from '../support/loginHelper.js'
import agreementsPage from '../page-objects/agreements.page.js'

When(/^the user accept the agreement$/, async function () {
  await loginToAgreement()
  await agreementsPage.clickLinkByText('Continue')
  await agreementsPage.selectCheckBoxByValue('confirmed')
  await agreementsPage.clickButtonByText('Accept agreement offer')
  const actualApplicationText = await agreementsPage.getHeaderText()
  await expect(actualApplicationText).toEqual('Agreement offer accepted')
})
