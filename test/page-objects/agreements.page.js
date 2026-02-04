import BasePage from '../page-objects/base.page.js'

class AgreementsPage extends BasePage {
  async validateSummaryListFromTable(dataTable) {
    const rows = dataTable.raw()
    const keys = rows[0]
    const values = rows[1]

    const tableRows = await $$('dl > div')

    for (let i = 0; i < keys.length; i++) {
      const expectedKey = keys[i].trim()
      const expectedValue = values[i].trim()

      const matchingRow = tableRows[i]

      const actualKey = (await matchingRow.$('dt').getText()).trim()

      await expect(actualKey).toEqual(expectedKey)

      let actualValue = (await matchingRow.$('dd').getText()).trim()
      actualValue = actualValue.replace(/\s+/g, ' ').trim()

      if (expectedValue.toUpperCase() === 'DATE') {
        const dateRegex = /^\d{1,2} \w{3} \d{4}$/
        await expect(actualValue).toMatch(dateRegex)
        continue
      }

      if (expectedKey.toUpperCase() === 'REFERENCE') {
        const refRegex = /^FPTT\d{9}$/
        await expect(actualValue).toMatch(refRegex)
        continue
      }

      await expect(actualValue).toEqual(expectedValue)
    }
  }
}

export default new AgreementsPage()
