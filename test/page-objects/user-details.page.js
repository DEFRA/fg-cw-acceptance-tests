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
}

export default new UserDetailsPage()
