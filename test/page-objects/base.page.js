export default class BasePage {
  /**
   * Returns text of an element (default: <h1>)
   */
  async getHeaderText(selector = 'h1') {
    const element = await $(selector)
    await element.waitForDisplayed({ timeout: 5000 })
    return await element.getText()
  }

  /**
   * Clicks a link by exact visible text
   */
  async clickLinkByText(text) {
    const link = await $(`=${text}`)
    await link.waitForClickable({ timeout: 5000 })
    await link.click()
  }

  /**
   * Waits for an element to be visible
   */
  async waitUntilVisible(selector) {
    const element = await $(selector)
    await element.waitForDisplayed({ timeout: 5000 })
  }

  /**
   * Enters value in a field
   */
  async enterText(selector, value) {
    const input = await $(selector)
    await input.waitForEnabled({ timeout: 5000 })
    await input.setValue(value)
  }

  /**
   * Gets value from an input
   */
  async getInputValue(selector) {
    const input = await $(selector)
    return await input.getValue()
  }
}
