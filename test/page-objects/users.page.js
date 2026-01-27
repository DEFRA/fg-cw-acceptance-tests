import BasePage from '../page-objects/base.page.js'

class UsersPage extends BasePage {
  get tableRows() {
    return $$('tbody.govuk-table__body tr.govuk-table__row')
  }

  async clickRandomViewAndCaptureDetails(world) {
    const rows = await this.tableRows
    if (rows.length === 0) {
      throw new Error('No user rows found')
    }

    const randomIndex = Math.floor(Math.random() * rows.length)
    const row = rows[randomIndex]

    const name = await row.$('th.govuk-table__header').getText()
    const email = await row.$$('td.govuk-table__cell')[0].getText()
    const lastLogin = await row.$$('td.govuk-table__cell')[1].getText()

    world.selectedUser = {
      name,
      email,
      lastLogin
    }
    await row.$('a.govuk-link').click()
  }
}

export default new UsersPage()
