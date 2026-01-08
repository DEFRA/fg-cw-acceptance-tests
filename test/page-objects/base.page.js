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

  async headerH2() {
    const h2Element = await $('h2')
    return h2Element.getText()
  }

  async selectRadioButtonByCaseText(caseText) {
    const caseLink = await $(
      "//a[normalize-space(text())='" + caseText + "']/ancestor::tr"
    )
    await caseLink.waitForExist()

    const radioButton = await caseLink.$('input[type="radio"]')
    await radioButton.click()
  }

  async alertText() {
    const alertBox = await $('div[role="alert"]')
    return await alertBox.getText()
  }

  async getTaskStatusByName(taskName) {
    const taskElements = await $$('[data-testid="taskList-li"]')
    const foundTasks = []

    for (const taskEl of taskElements) {
      const nameEl = await taskEl.$('.govuk-task-list__link')
      const nameText = await nameEl.getText()
      const cleanName = nameText.trim()

      foundTasks.push(cleanName)

      if (cleanName === taskName) {
        const statusEl = await taskEl.$('.govuk-task-list__status strong')
        return await statusEl.getText()
      }
    }

    console.log(`Looking for task: "${taskName}"`)
    console.log(`Found tasks:`, foundTasks)
    throw new Error(`Task with name "${taskName}" not found`)
  }

  async selectRadioByValue(value) {
    const radio = await $(`input[type="radio"][value="${value}"]`)
    await radio.click()
  }

  async selectRadioByLabel(labelText) {
    const locator = `//label[normalize-space()="${labelText}"]`

    const label = await $(locator)

    await label.waitForExist({ timeout: 5000 })
    await label.scrollIntoView()
    await label.click()
  }

  async selectRadioAndEnterText(labelText, text) {
    const radioLabel = await $(`//label[normalize-space()="${labelText}"]`)
    await radioLabel.waitForClickable({ timeout: 5000 })
    await radioLabel.click()

    const inputId = await radioLabel.getAttribute('for')
    const conditionalPanel = await $(`#conditional-${inputId}`)

    const textarea = await conditionalPanel.$('textarea')
    await textarea.waitForEnabled({ timeout: 5000 })

    await textarea.setValue(text)
  }

  async setCheckbox(selector) {
    const checkbox = await $(
      `#task-${selector.trim().toLowerCase().replace(/\s+/g, '-')}`
    )
    await checkbox.click()

    // verify
    await expect(checkbox).toBeSelected()
  }

  async waitForElement(text, timeout = 30000, interval = 3000) {
    await browser.waitUntil(
      async () => {
        await browser.refresh()
        const link = await $(`//a[normalize-space(.)="${text}"]`)
        return await link.isDisplayed()
      },
      {
        timeout,
        interval,
        timeoutMsg: `Text "${text}" not found after ${timeout}ms`
      }
    )

    return await $(`//a[normalize-space(.)="${text}"]`)
  }

  async selectRandomRadioButton() {
    const radios = await $$('input[type="radio"]:enabled')

    if (radios.length === 0) {
      throw new Error('No radio buttons found on the page')
    }

    const randomIndex = Math.floor(Math.random() * radios.length)
    await radios[randomIndex].scrollIntoView()
    await radios[randomIndex].click()
  }
}
