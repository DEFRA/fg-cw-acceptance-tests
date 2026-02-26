import { Given, Then, When } from '@wdio/cucumber-framework'
import UsersPage from '../page-objects/users.page.js'
import UserDetailsPage from '../page-objects/user-details.page.js'
import AdminPage from '../page-objects/admin.page.js'
import text from '../data/constants.json'
import UserRolesPage from '../page-objects/user-roles.page.js'
import RolesPage from '../page-objects/roles.page.js'
import CreateRolePage from '../page-objects/create-role.page.js'
import CreateUserPage from '../page-objects/create-user.page.js'
import EditRolePage from '../page-objects/edit-role.page.js'

Given('the user navigates to casework user management page', async function () {
  await browser.url('admin')
})
Then('the user should see Admin page', async function () {
  await expect(await AdminPage.getHeaderText()).toEqual(text.headers.adminPage)
})
When(
  'the user capture and navigate to the User details page',
  async function () {
    await UsersPage.clickRandomViewAndCaptureDetails(this)
  }
)
Then('the user should see correct user details', async function () {
  await UserDetailsPage.assertUserDetails(this.selectedUser)
})
Then('the user should see Users page', async function () {
  await expect(await UsersPage.getHeaderText()).toEqual(text.headers.usersPage)
})

Then('the user should see User roles page', async function () {
  await expect(await UserRolesPage.getHeaderText()).toEqual(
    this.selectedUser.name + ' roles'
  )
})
Then('the user capture the displayed app roles', async function () {
  this.selectedAppRoles = await UserDetailsPage.getManageGrantsRoles()
})
Then('the user should see same app roles pre-selected', async function () {
  await UserRolesPage.assertPreSelectedRoles(this.selectedAppRoles)
})
Then(/^the user should be same as pre-selected$/, async function () {
  await UserRolesPage.assertPreSelectedUser(this.selectedUser)
})
Then(/^the user should see Roles page$/, async function () {
  await expect(await RolesPage.getHeaderText()).toEqual(text.headers.rolesPage)
})
Then(/^the user should see Create Role page$/, async function () {
  await expect(await CreateRolePage.getHeaderText()).toEqual(
    text.headers.createRolePage
  )
})
When(/^the user create a new role with random data$/, async function () {
  this.createdRole = await CreateRolePage.createRoleWithRandomData()
})
Then(/^the role should be created successfully$/, async function () {
  await RolesPage.assertRoleExists(this.createdRole)
})
When(/^the user create a new role with incorrect code$/, async function () {
  this.createdRole = await CreateRolePage.createRoleWithRandomData('jksdf&((((')
})
Then(/^the user should see Create user page$/, async function () {
  await expect(await CreateUserPage.getHeaderText()).toEqual(
    text.headers.createUserPage
  )
})
When(/^the user selects a random role$/, async function () {
  this.selectedRoleCode = await RolesPage.selectRandomRole()
})
Then(/^the user should be on the edit role page$/, async function () {
  await expect(await CreateUserPage.getHeaderText()).toEqual(
    `Update ${this.selectedRoleCode}`
  )
})
When(
  /^the user updates the role description with a random value$/,
  async function () {
    this.getDescriptionValue = await EditRolePage.getDescriptionValue()
    this.updatedDescription = await EditRolePage.updateDescription()
  }
)
Then(
  'the user should see previously selected role description updated correctly',
  async function () {
    const updatedDescription = await RolesPage.getDescriptionByCode(
      this.selectedRoleCode
    )
    await expect(updatedDescription).toEqual(this.updatedDescription)
  }
)
When(/^the user clear the edit role description value$/, async function () {
  await EditRolePage.clearDescriptionInput()
})

When('the user selects a random assignable role', async function () {
  const rows = await $$('table tbody tr')

  const assignableRoles = []

  for (const row of rows) {
    const assignableText = await row.$('td:nth-child(3)').getText()

    if (assignableText.trim() === 'Yes') {
      const link = await row.$('th a')
      const roleCode = await link.getText()

      assignableRoles.push({ link, roleCode })
    }
  }

  if (assignableRoles.length === 0) {
    throw new Error('No assignable roles found')
  }

  const randomIndex = Math.floor(Math.random() * assignableRoles.length)
  this.selectedRoleCode = assignableRoles[randomIndex].roleCode
  await assignableRoles[randomIndex].link.click()
})

When(
  'the user sets "Allow this role to be assigned?" to "No"',
  async function () {
    const noRadio = await $('input[name="assignable"][value="false"]')
    await noRadio.click()
  }
)

Then(
  'the selected role should show {string} in the Assignable column',
  async function (expected) {
    const actual = await RolesPage.getAssignableByCode(this.selectedRoleCode)
    await expect(actual).toEqual(expected)
  }
)

Then('the role should not be available for assignment', async function () {
  await UserRolesPage.assertRoleNotAvailable(this.selectedRoleCode)

  const userHasRole = await UserRolesPage.isRoleCurrentlyAssigned(
    this.selectedRoleCode
  )

  if (userHasRole) {
    await UserRolesPage.assertRoleAvailable(this.selectedRoleCode)
  } else {
    await UserRolesPage.assertRoleNotAvailable(this.selectedRoleCode)
  }
})

Then('the role is reverted back to assignable', async function () {
  await $('a=Manage roles').click()

  await RolesPage.roleRow(this.selectedRoleCode).$('th a').click()

  await EditRolePage.assertEditRolePageLoaded(this.selectedRoleCode)

  await EditRolePage.setAssignable('Yes')

  await EditRolePage.confirmUpdate()

  const assignable = await RolesPage.getAssignableByCode(this.selectedRoleCode)

  await expect(assignable).toEqual('Yes')
})
When(/^the user enters random user name$/, async function () {
  await CreateUserPage.enterName('NAME')
})
When(/^the user enters already existing email$/, async function () {
  await CreateUserPage.enterEmail(this.selectedUser.email)
})
When(/^the user capture random user details$/, async function () {
  await UsersPage.captureRandomUserDetails(this)
})
