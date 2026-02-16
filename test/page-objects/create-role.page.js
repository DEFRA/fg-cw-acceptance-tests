import BasePage from '../page-objects/base.page.js'

class CreateRolePage extends BasePage {
  get codeInput() {
    return $('#code')
  }

  get descriptionInput() {
    return $('#description')
  }

  get assignableYesRadio() {
    return $('#assignable')
  }

  get assignableNoRadio() {
    return $('#assignable-2')
  }

  get confirmButton() {
    return $('button[type="submit"]')
  }

  async enterCode(code) {
    await this.codeInput.waitForDisplayed()
    await this.codeInput.setValue(code)
  }

  async enterDescription(description) {
    await this.descriptionInput.waitForDisplayed()
    await this.descriptionInput.setValue(description)
  }

  async selectAssignable(option = true) {
    if (option) {
      await this.assignableYesRadio.click()
    } else {
      await this.assignableNoRadio.click()
    }
  }

  async clickConfirm() {
    await this.confirmButton.waitForClickable()
    await this.confirmButton.click()
  }

  generateRandomRoleCode() {
    const firstChar = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
    let rest = ''
    const length = 5 + Math.floor(Math.random() * 4) // 5-8 chars
    for (let i = 0; i < length; i++) {
      rest += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return (firstChar + rest).toUpperCase() // ensure uppercase
  }

  generateRandomDescription() {
    return `AutoDesc_${Math.random().toString(36).substring(2, 8)}`
  }

  async createRoleWithRandomData(code = '', assignable = true) {
    const roleCode =
      code && code.trim().length > 0
        ? code
        : `ROLE_${this.generateRandomRoleCode()}`

    const description = this.generateRandomDescription()

    await this.enterCode(roleCode)
    await this.enterDescription(description)
    await this.selectAssignable(assignable)
    await this.clickConfirm()

    return {
      code,
      description,
      assignable
    }
  }
}
export default new CreateRolePage()
