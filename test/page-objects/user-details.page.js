import BasePage from '../page-objects/base.page.js'
import dayjs from 'dayjs'

class UserDetailsPage extends BasePage {
  getSummaryValue(label) {
    return $(`//dt[normalize-space()="${label}"]/following-sibling::dd`)
  }

  get userEmail() {
    return this.getSummaryValue('Email')
  }

  async getHeader() {
    return await $('h1').getText()
  }

  get userLastLogin() {
    return this.getSummaryValue('Last login')
  }

  get idpRoles() {
    return this.getSummaryValue('Identity provider (IDP) roles')
  }

  get manageGrantsRoles() {
    return this.getSummaryValue('Manage grants roles')
  }

  get updateRolesButton() {
    return $('a.-button--secondary')
  }

  async assertUserDetails(expected) {
    console.log(expected)
    const actualHeading = (await this.getHeader()).trim()
    console.log(actualHeading)
    console.log('*****************')
    const actualEmail = (await this.userEmail.getText()).trim()
    const actualLastLogin = (await this.userLastLogin.getText()).trim()

    const formattedActualLastLogin = dayjs(
      actualLastLogin,
      'D MMMM YYYY HH:mm'
    ).format('D MMM YYYY HH:mm')

    console.log(actualEmail)
    console.log('******actualEmail***********')

    await expect(actualHeading).toEqual(expected.name + ' details')
    await expect(actualEmail).toEqual(expected.email)

    if (expected.lastLogin) {
      await expect(formattedActualLastLogin).toEqual(expected.lastLogin)
    }
  }

  async getManageGrantsRoles() {
    const rolesText = await this.manageGrantsRoles.getText()
    return rolesText
      .split('\n')
      .map((role) => role.trim())
      .filter(Boolean)
  }

  async getIdpRoles() {
    const rolesText = await this.idpRoles.getText()
    return rolesText
      .split('\n')
      .map((role) => role.trim())
      .filter(Boolean)
  }
}

export default new UserDetailsPage()
