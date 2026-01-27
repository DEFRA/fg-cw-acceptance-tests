import { When } from '@wdio/cucumber-framework'
import AdminPage from '../page-objects/admin.page.js'

When('the user navigates to the {string} page', async function (linkText) {
  await AdminPage.clickLinkByText(linkText)
})
