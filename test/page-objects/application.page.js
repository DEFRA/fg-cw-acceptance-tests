import BasePage from '../page-objects/base.page.js'

class ApplicationPage extends BasePage {
  async header() {
    const h1Element = await $('h1')
    return await h1Element.getText()
  }
}

export default new ApplicationPage()
