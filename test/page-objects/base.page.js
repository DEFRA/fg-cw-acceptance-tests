import { config } from '../../wdio.conf.js'

export default class BasePage {
  async getHeaderText(selector = 'h1') {
    const element = await $(selector)
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    return await element.getText()
  }

  async clickLinkByText(text) {
    const link = await $(`=${text}`)
    await link.waitForClickable({ timeout: config.waitforTimeout })
    await link.click()
  }

  async clickButtonByText(text) {
    const button = await $(`button=${text}`)
    await button.waitForClickable({ timeout: config.waitforTimeout })
    await button.click()
  }

  async waitUntilVisible(selector) {
    const element = await $(`=${selector}`)
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    return await element.isDisplayed()
  }

  async enterText(selector, value) {
    const input = await $(selector)
    await input.waitForEnabled({ timeout: config.waitforTimeout })
    await input.setValue(value)
  }

  async getInputValue(selector) {
    const input = await $(selector)
    return await input.getValue()
  }

  async selectRadioButtonByCaseText(caseText) {
    const caseLink = await $(
      "//a[normalize-space(text())='" + caseText + "']/ancestor::tr"
    )
    await caseLink.waitForExist()

    const radioButton = await caseLink.$('input[type="radio"]')
    await radioButton.click()
  }

  async getTaskStatusByName(taskName) {
    const taskElements = await $$('[data-testid="taskList-li"]')

    for (const taskEl of taskElements) {
      const nameEl = await taskEl.$('.govuk-link')
      const nameText = await nameEl.getText()

      if (nameText.trim() === taskName) {
        const statusEl = await taskEl.$('.govuk-task-list__status strong')
        return await statusEl.getText()
      }
    }

    throw new Error(`Task with name "${taskName}" not found`)
  }
}
