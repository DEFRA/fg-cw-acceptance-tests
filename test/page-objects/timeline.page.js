import BasePage from '../page-objects/base.page.js'

class TimelinePage extends BasePage {
  get timelineTable() {
    return $('.govuk-table')
  }

  get timelineRows() {
    return $$('.govuk-table tbody tr')
  }

  rowByClientRef(clientRef) {
    return $(
      `//table[contains(@class,"govuk-table")]//tbody//tr[td[1][normalize-space()="${clientRef}"]]`
    )
  }

  viewCaseLinkByClientRef(clientRef) {
    return $(
      `//table[contains(@class,"govuk-table")]//tbody//tr[td[1][normalize-space()="${clientRef}"]]//a[normalize-space()="View case"]`
    )
  }

  async waitForTimelineTable() {
    await this.timelineTable.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Timeline table was not displayed'
    })
  }

  async getTimelineRowData() {
    const rows = await this.timelineRows
    const data = []

    for (const row of rows) {
      const cells = await row.$$('td')

      data.push({
        id: (await cells[0].getText()).trim(),
        dateReceived: (await cells[1].getText()).trim(),
        dateEnded: (await cells[2].getText()).trim(),
        status: (await cells[3].getText()).trim(),
        action: (await cells[4].getText()).trim()
      })
    }

    return data
  }

  async getTimelineRowByClientRef(clientRef) {
    const rows = await this.getTimelineRowData()
    return rows.find((row) => row.id === clientRef)
  }

  async getTodayDisplayDate() {
    const today = new Date()

    const day = today.getDate()
    const month = today.toLocaleString('en-GB', { month: 'short' })
    const year = today.getFullYear()

    return `${day} ${month} ${year}`
  }

  async clickViewCaseForClientRef(clientRef) {
    const link = await this.viewCaseLinkByClientRef(clientRef)
    await link.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: `View case link was not displayed for clientRef: ${clientRef}`
    })
    await link.click()
  }
}

export default new TimelinePage()
