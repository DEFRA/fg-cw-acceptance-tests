import BasePage from '../page-objects/base.page.js'

class UsersPage extends BasePage {
  get tableRows() {
    return $$('tbody.govuk-table__body tr.govuk-table__row')
  }

  async captureRandomUserDetails(world) {
    const rows = await this.tableRows

    if (rows.length === 0) {
      throw new Error('No user rows found')
    }

    const currentUser = await browser.sharedStore.get('currentUser')

    const eligibleRows = []

    for (const row of rows) {
      const name = await row.$('th.govuk-table__header').getText()
      const cells = await row.$$('td.govuk-table__cell')
      const email = await cells[0].getText()
      const lastLogin = await cells[1].getText()

      if (email.trim() !== currentUser?.username?.trim()) {
        eligibleRows.push({ row, name, email, lastLogin })
      }
    }

    if (eligibleRows.length === 0) {
      throw new Error('No eligible users found (only current user present)')
    }

    const randomIndex = Math.floor(Math.random() * eligibleRows.length)
    const selected = eligibleRows[randomIndex]

    world.selectedUser = {
      name: selected.name.trim(),
      email: selected.email.trim(),
      lastLogin: selected.lastLogin.trim()
    }
  }

  async clickRandomViewAndCaptureDetails(world) {
    const rows = await this.tableRows

    if (rows.length === 0) {
      throw new Error('No user rows found')
    }

    const currentUser = await browser.sharedStore.get('currentUser')

    const eligibleRows = []

    for (const row of rows) {
      const name = await row.$('th.govuk-table__header').getText()
      const cells = await row.$$('td.govuk-table__cell')
      const email = await cells[0].getText()
      const lastLogin = await cells[1].getText()

      if (email.trim() !== currentUser?.username?.trim()) {
        eligibleRows.push({ row, name, email, lastLogin })
      }
    }

    if (eligibleRows.length === 0) {
      throw new Error('No eligible users found (only current user present)')
    }

    const randomIndex = Math.floor(Math.random() * eligibleRows.length)
    const selected = eligibleRows[randomIndex]

    world.selectedUser = {
      name: selected.name.trim(),
      email: selected.email.trim(),
      lastLogin: selected.lastLogin.trim()
    }

    await selected.row.$('a.govuk-link').click()
  }
}

export default new UsersPage()
