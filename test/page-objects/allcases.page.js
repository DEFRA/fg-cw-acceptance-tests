// import { clickLinkByText } from '../page-objects/uiHelper.js'
import BasePage from '../page-objects/base.page.js'

class AllCasesPage extends BasePage {
  async headerH2() {
    const h2Element = await $('#all-cases > h2')
    return await h2Element.getText()
  }

  async allCases() {
    const rows = await $$(`#all-cases > table > tbody > tr`)
    return rows.length
  }
}

export default new AllCasesPage()
