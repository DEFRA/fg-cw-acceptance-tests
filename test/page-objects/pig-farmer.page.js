import BasePage from './base.page.js'

class PigFarmerPage extends BasePage {
  get startNowButton() {
    return $('button[data-prevent-double-click="true"].govuk-button--start')
  }

  get isPigFarmerYes() {
    return $('input[id="isPigFarmer"]')
  }

  get isPigFarmerYesLabel() {
    return $('label[for="isPigFarmer"]')
  }

  get totalPigsInput() {
    return $('input[name="totalPigs"]')
  }

  get continueButton() {
    return $('button[data-prevent-double-click="true"].govuk-button')
  }

  get sendButton() {
    return $('button[data-prevent-double-click="true"].govuk-button')
  }

  get largeWhiteCheckbox() {
    return $('=Large White')
  }

  get britishLandraceCheckbox() {
    return $('=British Landrace')
  }

  get berkshireCheckbox() {
    return $('=Berkshire')
  }

  get otherCheckbox() {
    return $('=Other')
  }

  get whitePigsCountInput() {
    return $('input[name="whitePigsCount"]')
  }

  get britishLandracePigsCountInput() {
    return $('input[name="britishLandracePigsCount"]')
  }

  get berkshirePigsCountInput() {
    return $('input[name="berkshirePigsCount"]')
  }

  get otherPigsCountInput() {
    return $('input[name="otherPigsCount"]')
  }

  get referenceNumber() {
    return $('.govuk-panel__body strong')
  }

  get confirmationPanel() {
    return $('.govuk-panel--confirmation')
  }

  async clickStartNow() {
    await this.startNowButton.waitForClickable()
    await this.startNowButton.click()
  }

  async selectPigFarmerYes() {
    await this.isPigFarmerYesLabel.waitForClickable()
    await this.isPigFarmerYesLabel.click()
  }

  async enterTotalPigs(count) {
    await this.totalPigsInput.waitForEnabled()
    await this.totalPigsInput.setValue(count)
  }

  async clickContinue() {
    await this.continueButton.waitForClickable()
    await this.continueButton.click()
  }

  async clickSend() {
    await this.sendButton.waitForClickable()
    await this.sendButton.click()
  }

  async selectAllPigBreeds() {
    await this.largeWhiteCheckbox.waitForClickable()
    await this.largeWhiteCheckbox.click()

    await this.britishLandraceCheckbox.waitForClickable()
    await this.britishLandraceCheckbox.click()

    await this.berkshireCheckbox.waitForClickable()
    await this.berkshireCheckbox.click()

    await this.otherCheckbox.waitForClickable()
    await this.otherCheckbox.click()
  }

  async enterWhitePigsCount(count) {
    await this.whitePigsCountInput.waitForEnabled()
    await this.whitePigsCountInput.setValue(count)
  }

  async enterBritishLandracePigsCount(count) {
    await this.britishLandracePigsCountInput.waitForEnabled()
    await this.britishLandracePigsCountInput.setValue(count)
  }

  async enterBerkshirePigsCount(count) {
    await this.berkshirePigsCountInput.waitForEnabled()
    await this.berkshirePigsCountInput.setValue(count)
  }

  async enterOtherPigsCount(count) {
    await this.otherPigsCountInput.waitForEnabled()
    await this.otherPigsCountInput.setValue(count)
  }

  async getReferenceNumber() {
    await this.referenceNumber.waitForDisplayed()
    return await this.referenceNumber.getText()
  }

  async isConfirmationPageDisplayed() {
    await this.confirmationPanel.waitForDisplayed()
    return await this.confirmationPanel.isDisplayed()
  }

  async navigateToCasesPage() {
    await browser.url(
      'https://fg-cw-frontend.dev.cdp-int.defra.cloud/cases/#all-cases'
    )
  }

  async isReferenceNumberInTable(referenceNumber) {
    const link = await $(`=${referenceNumber}`)
    await link.waitForExist({ timeout: 10000 })

    // Scroll to make it visible
    await link.scrollIntoView()
    await browser.pause(500)

    return await link.isDisplayed()
  }

  async clickReferenceNumberInTable(referenceNumber) {
    // First wait for the page to load completely
    await browser.waitUntil(
      async () =>
        (await browser.execute(() => document.readyState)) === 'complete',
      { timeout: 10000, timeoutMsg: 'Cases page did not load completely' }
    )

    // Give some time for the table to render
    await browser.pause(2000)

    const link = await $(`=${referenceNumber}`)
    await link.waitForClickable({ timeout: 10000 })
    await link.click()
  }
}

export default new PigFarmerPage()
