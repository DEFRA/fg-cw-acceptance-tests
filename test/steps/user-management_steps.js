import { Given, Then, When } from '@wdio/cucumber-framework'
import UsersPage from '../page-objects/users.page.js'
import UserDetailsPage from '../page-objects/user-details.page.js'
import AdminPage from '../page-objects/admin.page.js'
import text from '../data/constants.json'
import UserRolesPage from '../page-objects/user-roles.page.js'

Given('the user navigates to casework user management page', async function () {
  await browser.url('admin')
})
Then('the user should see Admin page', async function () {
  await expect(await AdminPage.getHeaderText()).toEqual(text.headers.adminPage)
})
When('the user navigate to the User details page', async function () {
  await UsersPage.clickRandomViewAndCaptureDetails(this)
})
Then('the user should see correct user details', async function () {
  await UserDetailsPage.assertUserDetails(this.selectedUser)
})
Then('the user should see Users page', async function () {
  await expect(await UsersPage.getHeaderText()).toEqual(text.headers.usersPage)
})

Then('the user should see User roles page', async function () {
  await expect(await UserRolesPage.getHeaderText()).toEqual(
    text.headers.userRolesPage
  )
})
Then('the user capture the displayed app roles', async function () {
  this.selectedAppRoles = await UserDetailsPage.getAppRoles()
})
Then('the user should see same app roles pre-selected', async function () {
  await UserRolesPage.assertPreSelectedRoles(this.selectedAppRoles)
})
Then(/^the user should be same as pre-seleted$/, async function () {
  await UserRolesPage.assertPreSelectedUser(this.selectedUser)
})
