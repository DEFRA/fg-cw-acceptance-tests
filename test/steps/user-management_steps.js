import { Given, Then, When } from '@wdio/cucumber-framework'
import UsersPage from '../page-objects/users.page.js'
import UserDetailsPage from '../page-objects/user-details.page.js'
import AdminPage from '../page-objects/admin.page.js'
import text from '../data/constants.json'

Given('the user navigates to casework user management page', async function () {
  await browser.url('admin')
})
Then('the user should see admin page', async function () {
  await expect(await AdminPage.getHeaderText()).toEqual(text.headers.adminPage)
})
When('the user navigate to the user details page', async function () {
  await UsersPage.clickRandomViewAndCaptureDetails(this)
})
Then('the user should see correct user details', async function () {
  await UserDetailsPage.assertUserDetails(this.selectedUser)
})
Then('the user should see Users page', async function () {
  await expect(await UsersPage.getHeaderText()).toEqual(text.headers.usersPage)
})
