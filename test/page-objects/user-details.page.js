import BasePage from '../page-objects/base.page.js'

class UserDetailsPage extends BasePage {
  getSummaryValue(label) {
    return $(`//dt[normalize-space()="${label}"]/following-sibling::dd`)
  }

  get userName() {
    return this.getSummaryValue('Full name')
  }

  get userEmail() {
    return this.getSummaryValue('Email')
  }

  get userLastLogin() {
    return this.getSummaryValue('Last login')
  }

  async assertUserDetails(expected) {
    const actualName = (await this.userName.getText()).trim()
    const actualEmail = (await this.userEmail.getText()).trim()

    await expect(actualName).toEqual(expected.name)
    await expect(actualEmail).toEqual(expected.email)
  }

  get appRoleTags() {
    return $$(
      '//h2[normalize-space()="App roles"]/following-sibling::div//strong'
    )
  }

  get noAppRolesMessage() {
    return $('p=No App Roles have been allocated to this user')
  }

  async getAppRoles() {
    if (await this.noAppRolesMessage.isExisting()) {
      return []
    }

    const roles = []
    for (const role of await this.appRoleTags) {
      roles.push((await role.getText()).trim())
    }
    return roles
  }
}

export default new UserDetailsPage()
