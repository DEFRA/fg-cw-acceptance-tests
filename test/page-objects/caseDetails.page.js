import BasePage from '../page-objects/base.page.js'

class CaseDetailsPage extends BasePage {
  get caseSummaryRow() {
    return $('.app-case-row')
  }

  get applicationIdField() {
    return $(
      `//div[contains(@class,"app-case-cell")]//p[contains(normalize-space(.),"Application ID:")]`
    )
  }

  get statusField() {
    return $(
      `//div[contains(@class,"app-case-cell")]//p[contains(normalize-space(.),"Status:")]`
    )
  }

  async waitForCaseSummary() {
    await this.caseSummaryRow.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Case summary row was not displayed'
    })
  }

  async getApplicationIdText() {
    await this.applicationIdField.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Application ID field was not displayed'
    })

    return (await this.applicationIdField.getText()).trim()
  }

  async getStatusText() {
    await this.statusField.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Status field was not displayed'
    })

    return (await this.statusField.getText()).trim()
  }
}

export default new CaseDetailsPage()
