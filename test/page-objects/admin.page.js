import BasePage from '../page-objects/base.page.js'

class AdminPage extends BasePage {
  async isExactPermissionMessageDisplayed() {
    const heading = await $('h1').getText()
    const paragraph = await $('p').getText()

    return (
      heading === 'You do not have access to this page' &&
      paragraph === 'If you think you should have access, contact your manager.'
    )
  }
}
export default new AdminPage()
