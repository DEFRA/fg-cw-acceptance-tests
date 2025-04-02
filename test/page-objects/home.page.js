class HomePage {
  async header() {
    const h1Element = await $('h1')
    return await h1Element.getText()
  }

  async headerH2() {
    const h2Element = await $('#all-cases > h2')
    return await h2Element.getText()
  }

  async clickLinkByText(linkText) {
    const link = await $('#tab_all-cases')
    await link.waitForDisplayed()
    await link.click()
  }

  async allCases() {
    const rows = await $$(`#all-cases > table > tbody > tr`)
    return rows.length
  }
}

export default new HomePage()
