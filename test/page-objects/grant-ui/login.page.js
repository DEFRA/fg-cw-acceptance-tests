import BasePage from '../base.page.js'

class LoginPage extends BasePage {
  async login(crn, password) {
    const usernameInput = await $('#crn')
    const passwordInput = await $('#password')
    const submitButton = await $('button[type="submit"]')

    await usernameInput.setValue(crn)
    await passwordInput.setValue(password)
    await submitButton.click()
  }
}

export default new LoginPage()
