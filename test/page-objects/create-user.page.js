import BasePage from '../page-objects/base.page.js'

class CreateUserPage extends BasePage {
  get nameInput() {
    return $('#name')
  }

  get emailInput() {
    return $('#email')
  }

  async enterName(name) {
    await this.nameInput.waitForDisplayed()
    await this.nameInput.setValue(name)
  }

  async enterEmail(email) {
    await this.emailInput.waitForDisplayed()
    await this.emailInput.setValue(email)
  }
}
export default new CreateUserPage()
