import { $ } from '@wdio/globals'
import BasePage from './base.page.js'

class LandFundingPage extends BasePage {
  // Selectors
  get startNowButton() {
    return $('button.govuk-button--start')
  }

  get continueButton() {
    return $('button.govuk-button')
  }

  get landDetailsYesRadio() {
    return $('input#hasCheckedLandIsUpToDate')
  }

  get agreementNameInput() {
    return $('input#agreementName')
  }

  get landParcelRadio() {
    return $('input[value="SD6743-8083"]')
  }

  get actionCheckbox() {
    return $('input#selectedActions')
  }

  get quantityInput() {
    return $('input#qty-CMOR1')
  }

  get addMoreActionsNoRadio() {
    return $('input[value="false"]')
  }

  get submitButton() {
    return $('button=I agree - submit my application')
  }

  get confirmationPanel() {
    return $('.govuk-panel--confirmation')
  }

  get referenceNumber() {
    return $('.govuk-panel__body strong')
  }

  // Actions
  async navigateToApplication() {
    const environment = process.env.ENVIRONMENT || 'dev'
    await browser.url(
      `https://grants-ui.${environment}.cdp-int.defra.cloud/find-funding-for-land-or-farms/start`
    )
  }

  async clickStartNow() {
    await this.startNowButton.waitForDisplayed()
    await this.startNowButton.click()
  }

  async clickContinue() {
    await this.continueButton.waitForDisplayed()
    await this.continueButton.click()
  }

  async confirmLandDetailsCorrect() {
    await this.landDetailsYesRadio.waitForDisplayed()
    await this.landDetailsYesRadio.click()
  }

  async enterAgreementName(agreementName) {
    await this.agreementNameInput.waitForDisplayed()
    await this.agreementNameInput.setValue(agreementName)
  }

  async selectLandParcel() {
    await this.landParcelRadio.waitForDisplayed()
    await this.landParcelRadio.click()
  }

  async selectAction() {
    await this.actionCheckbox.waitForDisplayed()
    await this.actionCheckbox.click()
  }

  async enterQuantity(quantity) {
    await this.quantityInput.waitForDisplayed()
    await this.quantityInput.setValue(quantity)
  }

  async selectNoMoreActions() {
    await this.addMoreActionsNoRadio.waitForDisplayed()
    await this.addMoreActionsNoRadio.click()
  }

  async verifyApplicationSummary(expectedData) {
    const summaryList = await $('.govuk-summary-list')
    await summaryList.waitForDisplayed()

    for (const [key, value] of Object.entries(expectedData)) {
      let keyText
      switch (key) {
        case 'SBI':
          keyText = 'Single business identifier (SBI)'
          break
        case 'Indicative annual payment':
          keyText = 'Indicative annual payment (excluding management payment)'
          break
        case 'Land details correct':
          keyText = 'Do your digital maps show the correct land details?'
          break
        case 'Agreement name':
          keyText = 'Agreement name'
          break
        case 'Total actions':
          keyText = 'Total number of actions applied for'
          break
        case 'Land parcel':
          keyText = 'SD6743-8083'
          break
        default:
          keyText = key
      }

      if (key === 'Action' || key === 'Applied area') {
        // For action details, check the specific cell content in the land parcel row
        const actionCell = await $(
          `//div[@class='govuk-summary-list__row govuk-summary-list__row--no-actions'][dt[@class='govuk-summary-list__key govuk-!-font-weight-regular' and text()='SD6743-8083']]/dd[@class='govuk-summary-list__value']`
        )
        await actionCell.waitForDisplayed()
        const cellText = await actionCell.getText()
        if (key === 'Action') {
          if (
            !cellText.includes(
              'CMOR1: Assess moorland and produce a written record'
            )
          ) {
            throw new Error(
              `Expected action to contain "CMOR1: Assess moorland and produce a written record", but got ${cellText}`
            )
          }
        } else if (key === 'Applied area') {
          if (!cellText.includes('4.53411065 ha')) {
            throw new Error(
              `Expected applied area to contain "4.53411065 ha", but got ${cellText}`
            )
          }
        }
      } else {
        // Use a simpler approach - find the key element, then find the value element
        const keyElement = await $(`dt.govuk-summary-list__key=${keyText}`)
        await keyElement.waitForDisplayed()
        const parentRow = await keyElement.$('..')
        const valueElement = await parentRow.$('dd.govuk-summary-list__value')
        const cellText = await valueElement.getText()
        if (cellText.trim() !== value) {
          throw new Error(
            `Expected ${keyText} to be "${value}", but got "${cellText.trim()}"`
          )
        }
      }
    }
  }

  async submitApplication() {
    await this.submitButton.waitForDisplayed()
    await this.submitButton.click()
  }

  async isConfirmationPageDisplayed() {
    await this.confirmationPanel.waitForDisplayed()
    return await this.confirmationPanel.isDisplayed()
  }

  async getReferenceNumber() {
    await this.referenceNumber.waitForDisplayed()
    const rawText = await this.referenceNumber.getText()
    if (!rawText) {
      throw new Error('Reference number not found or empty')
    }
    return rawText.replace(/^=/, '').trim().toLowerCase()
  }

  async verifyReferenceNumberFormat(referenceNumber) {
    const pattern = /^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/
    return pattern.test(referenceNumber)
  }

  async submitCompleteApplication() {
    // Navigate to application
    await this.navigateToApplication()

    // Complete the application flow
    await this.clickStartNow()
    await this.clickContinue() // Confirm details
    await this.confirmLandDetailsCorrect()
    await this.clickContinue()
    await this.enterAgreementName("Joe's Farm Funding 2025")
    await this.clickContinue()
    await this.selectLandParcel()
    await this.clickContinue()
    await this.selectAction()
    await this.enterQuantity('4.53411065')
    await this.clickContinue()
    await this.selectNoMoreActions()
    await this.clickContinue()
    await this.clickContinue() // Continue from summary page
    await this.submitApplication()

    // Get the reference number from confirmation page
    return await this.getReferenceNumber()
  }

  // Caseworker functionality methods
  async navigateToCasesPage() {
    const environment = process.env.ENVIRONMENT || 'dev'
    await browser.url(
      `https://fg-cw-frontend.${environment}.cdp-int.defra.cloud/cases/#all-cases`
    )
  }

  async isReferenceNumberInTable(referenceNumber) {
    const link = await $(`=
    ${referenceNumber}`)
    await link.waitForExist({ timeout: 10000 })
    await link.scrollIntoView()
    await browser.pause(500)
    return await link.isDisplayed()
  }

  async verifySubmittedAnswers() {
    // For land funding, verify the specific answers that would be submitted
    // The case details page uses govuk-table structure, not govuk-summary-list

    // Wait for the answers table caption to be displayed
    const answersCaption = await $('caption.govuk-table__caption=Answers')
    await answersCaption.waitForDisplayed()

    const expectedAnswers = {
      hasCheckedLandIsUpToDate: 'true',
      agreementName: "Joe's Farm Funding 2025",
      scheme: 'SFI',
      year: '2025'
    }

    for (const [key, value] of Object.entries(expectedAnswers)) {
      // Use XPath to find the table row that contains the specific key and get its data cell
      const dataCell = await $(
        `//tr[@class='govuk-table__row'][th[@class='govuk-table__header govuk-!-width-one-third' and text()='${key}']]/td[@class='govuk-table__cell']`
      )
      await dataCell.waitForDisplayed()
      const cellText = await dataCell.getText()
      if (cellText.trim() !== value) {
        throw new Error(
          `Expected ${key} to be "${value}", but got "${cellText.trim()}"`
        )
      }
    }

    // Verify the action details in the action cases data table
    // First, find the "Action cases data" heading to locate the correct table
    const actionCasesHeading = await $('h2.govuk-heading-m=Action cases data')
    await actionCasesHeading.waitForDisplayed()

    const actionExpectedAnswers = {
      code: 'CMOR1',
      sheetId: 'SD6743',
      parcelId: '8083',
      appliedFor: '4.53411065 ha'
    }

    for (const [key, value] of Object.entries(actionExpectedAnswers)) {
      // Use XPath to find the table row that comes after the "Action cases data" heading
      const dataCell = await $(
        `//h2[@class='govuk-heading-m' and text()='Action cases data']/following-sibling::*//tr[@class='govuk-table__row'][th[@class='govuk-table__header govuk-!-width-one-third' and text()='${key}']]/td[@class='govuk-table__cell']`
      )
      await dataCell.waitForDisplayed()
      const cellText = await dataCell.getText()
      if (cellText.trim() !== value) {
        throw new Error(
          `Expected ${key} to be "${value}", but got "${cellText.trim()}"`
        )
      }
    }

    console.log('Verified land funding application answers')
  }

  async completeReviewApplicationDataTask() {
    // Click on the Review application data task link
    const reviewTaskLink = await $(
      'a.govuk-task-list__link=Review application data'
    )
    await reviewTaskLink.waitForDisplayed()
    await reviewTaskLink.click()

    // Check the Review application data checkbox
    const reviewCheckbox = await $('input#task-review-application-data')
    await reviewCheckbox.waitForDisplayed()
    await reviewCheckbox.click()

    // Click Save and continue button
    const saveButton = await $('button[data-testid="save-and-continue-button"]')
    await saveButton.waitForDisplayed()
    await saveButton.click()
  }

  async clickTasksTab() {
    const tasksTab = await $('a.govuk-service-navigation__link=Tasks')
    await tasksTab.waitForDisplayed()
    await tasksTab.click()
  }

  async acceptApplicationForAssessment() {
    await this.clickTasksTab()

    const acceptButton = await $('button=Accept')
    await acceptButton.waitForDisplayed()
    await acceptButton.click()
  }

  async verifyStageIs(expectedStage) {
    const stageHeading = await $(
      `h2[data-testid="stage-heading"]=${expectedStage}`
    )
    await stageHeading.waitForDisplayed()
    return await stageHeading.isDisplayed()
  }

  async verifyTaskSections(expectedSections) {
    for (const section of expectedSections) {
      let sectionHeading
      if (section.includes('Check Application')) {
        sectionHeading = await $('h3.govuk-heading-m=1. Check Application')
      } else if (section.includes('Registration Checks')) {
        sectionHeading = await $('h3.govuk-heading-m=2. Registration checks')
      } else {
        sectionHeading = await $(`h3.govuk-heading-m=${section}`)
      }

      await sectionHeading.waitForDisplayed()
      const isDisplayed = await sectionHeading.isDisplayed()
      if (!isDisplayed) {
        throw new Error(`Task section "${section}" is not displayed`)
      }
    }
  }

  async completeTask(taskName) {
    await this.clickLinkByText(taskName)

    let taskId
    switch (taskName) {
      case 'Check application and documents':
        taskId = 'check-application-and-documents'
        break
      case 'Check on Find farm and land payment data':
        taskId = 'check-find-farm-and-land-payment-data'
        break
      case 'Check on RPS (Dual Funding)':
        taskId = 'check-rps-dual-funding'
        break
      case 'Confirm farm has a CPH':
        taskId = 'confirm-farm-has-cph'
        break
      case 'Confirm APHA registration':
        taskId = 'confirm-apha-registration'
        break
      default:
        taskId = taskName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[()]/g, '')
        break
    }

    const checkbox = await $(`input#task-${taskId}`)
    await checkbox.waitForDisplayed()
    await checkbox.click()

    const saveButton = await $('button[data-testid="save-and-continue-button"]')
    await saveButton.waitForDisplayed()
    await saveButton.click()
  }

  async verifyAllTasksComplete() {
    const tasks = [
      'Check application and documents',
      'Check on Find farm and land payment data',
      'Check on RPS (Dual Funding)',
      'Confirm farm has a CPH',
      'Confirm APHA registration'
    ]

    for (const task of tasks) {
      const status = await this.getTaskStatusByName(task)
      expect(status).toBe('Complete')
    }
  }

  async approveApplication() {
    const confirmButton = await $('button=Confirm Approval')
    await confirmButton.waitForDisplayed()
    await confirmButton.click()
  }

  async verifySuccessfulApproval() {
    const contractedHeading = await $(
      'h2[data-testid="stage-heading"]=Contracted'
    )
    await contractedHeading.waitForDisplayed()
    return await contractedHeading.isDisplayed()
  }

  async clickTimelineTab() {
    const timelineTab = await $(
      'a.govuk-service-navigation__link[href*="/timeline"]'
    )
    await timelineTab.waitForDisplayed()
    await timelineTab.click()
  }

  async verifyTimelineItem(itemType, expectedCount = null) {
    // Wait for timeline to be displayed
    const timeline = await $('.timeline')
    await timeline.waitForDisplayed()

    // Get all timeline items with the specified type
    const timelineItems = await $$('.timeline__item')
    let matchingItems = 0

    for (const item of timelineItems) {
      const header = await item.$('.timeline__header h2')
      const headerText = await header.getText()

      if (headerText.trim() === itemType) {
        matchingItems++
      }
    }

    if (expectedCount !== null) {
      if (matchingItems !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} "${itemType}" timeline items, but found ${matchingItems}`
        )
      }
    } else {
      if (matchingItems === 0) {
        throw new Error(`No "${itemType}" timeline items found`)
      }
    }

    return matchingItems
  }

  async verifyTimelineItemExists(itemType) {
    return (await this.verifyTimelineItem(itemType)) > 0
  }

  async getTimelineItemCount(itemType) {
    return await this.verifyTimelineItem(itemType)
  }

  async verifyLatestTimelineItem(expectedItemType) {
    // Wait for timeline to be displayed
    const timeline = await $('.timeline')
    await timeline.waitForDisplayed()

    // Get the first (latest) timeline item
    const latestItem = await $('.timeline__item:first-child')
    const header = await latestItem.$('.timeline__header h2')
    const headerText = await header.getText()

    if (headerText.trim() !== expectedItemType) {
      throw new Error(
        `Expected latest timeline item to be "${expectedItemType}", but found "${headerText.trim()}"`
      )
    }

    return true
  }
}

export default new LandFundingPage()
