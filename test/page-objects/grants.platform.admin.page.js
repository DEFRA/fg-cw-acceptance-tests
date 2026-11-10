import BasePage from '../page-objects/base.page.js'

class GrantsPlatformAdminPage extends BasePage {
  async headerH2() {
    const h2Element = await $('h2')
    return await h2Element.getText()
  }

  async headerH3() {
    const h3Element = await $('h3')
    return await h3Element.getText()
  }

  async clickCreateClaim() {
    const link = await $(`[data-testid="available-entitlement-create"]`)
    await link.click()
  }
}

export default new GrantsPlatformAdminPage()
