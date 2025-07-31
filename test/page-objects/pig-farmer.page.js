import BasePage from './base.page.js'
import fs from 'fs'
import yaml from 'yaml'

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
    const rawText = await this.referenceNumber.getText()
    return rawText.replace(/^=/, '').trim().toLowerCase()
  }

  async isConfirmationPageDisplayed() {
    await this.confirmationPanel.waitForDisplayed()
    return await this.confirmationPanel.isDisplayed()
  }

  async navigateToCasesPage() {
    const environment = process.env.ENVIRONMENT || 'dev'
    await browser.url(
      `https://fg-cw-frontend.${environment}.cdp-int.defra.cloud/cases/#all-cases`
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

  async clickCaseDetailsTab() {
    const caseDetailsTab = await $(
      'a.govuk-service-navigation__link[href*="/case-details"]'
    )
    await caseDetailsTab.waitForDisplayed()
    await caseDetailsTab.click()
  }

  async verifySubmittedAnswers() {
    const file = fs.readFileSync('test/data/pigs-might-fly.yml', 'utf8')
    const parsedData = yaml.parse(file)
    const data = {}
    for (const section of Object.values(parsedData)) {
      Object.assign(data, section)
    }

    // Check the questions and answers match the YAML
    const questionElements = await $$('dl > div > dt')
    const answerElements = await $$('dl > div > dd')

    for (let i = 0; i < questionElements.length; i++) {
      const question = await questionElements[i].getText()
      const answer = await answerElements[i].getText()
      const expected = data[question]

      if (expected === undefined) {
        console.warn(`⚠️ No expected value for: "${question}"`)
      } else if (expected !== answer) {
        console.error(`❌ ${question}: Expected "${expected}", got "${answer}"`)
      } else {
        console.log(`✅ ${question}: "${answer}"`)
      }
    }
  }

  async clickTasksTab() {
    const tasksTab = await $('a.govuk-service-navigation__link=Tasks')
    await tasksTab.waitForDisplayed()
    await tasksTab.click()
  }

  async clickAcceptButton() {
    const acceptButton = await $('button=Accept')
    await acceptButton.waitForDisplayed()
    await acceptButton.click()
  }

  async isAssessmentStageDisplayed() {
    const assessmentHeading = await $(
      'h2[data-testid="stage-heading"]=Assessment'
    )
    await assessmentHeading.waitForDisplayed()
    return await assessmentHeading.isDisplayed()
  }

  async verifyAssessmentSections() {
    const checkApplicationSection = await $(
      'h3.govuk-heading-m=1. Check Application'
    )
    await checkApplicationSection.waitForDisplayed()

    const registrationChecksSection = await $(
      'h3.govuk-heading-m=2. Registration checks'
    )
    await registrationChecksSection.waitForDisplayed()

    return (
      (await checkApplicationSection.isDisplayed()) &&
      (await registrationChecksSection.isDisplayed())
    )
  }

  async clickTaskLink(taskName) {
    const taskLink = await $(`a.govuk-task-list__link = ${taskName}`)
    await taskLink.waitForDisplayed()
    await taskLink.click()
  }

  async checkTaskCheckbox(taskId) {
    const checkbox = await $(`input#task-${taskId}`)
    await checkbox.waitForDisplayed()
    await checkbox.click()
  }

  async clickSaveAndContinue() {
    const saveButton = await $('button[data-testid="save-and-continue-button"]')
    await saveButton.waitForDisplayed()
    await saveButton.click()
  }

  async verifyTaskStatus(taskName, expectedStatus) {
    // Use XPath to find the task list item that contains the specific task name and get its status
    const statusElement = await $(
      `/
      /
      li[

      @class='govuk-task-list__item govuk-task-list__item--with-link'][.//a[ @class='govuk-link govuk-task-list__link' and text()='${taskName}']]//strong[ @class='govuk-tag govuk-tag govuk-tag--blue']`
    )
    await statusElement.waitForDisplayed()
    const status = await statusElement.getText()
    return status === expectedStatus
  }

  async isContractedStageDisplayed() {
    const contractedHeading = await $(
      'h2[data-testid="stage-heading"]=Contracted'
    )
    await contractedHeading.waitForDisplayed()
    return await contractedHeading.isDisplayed()
  }

  async submitApplication() {
    // const environment = process.env.ENVIRONMENT || 'dev'
    await browser.url('/flying-pigs/start')

    // Fill out the application form following the exact flow from steps
    await this.clickStartNow()
    await this.selectPigFarmerYes()
    await this.clickContinue()
    await this.enterTotalPigs('100')
    await this.clickContinue()
    await this.selectAllPigBreeds()
    await this.clickContinue()
    await this.enterWhitePigsCount('25')
    await this.clickContinue()
    await this.enterBritishLandracePigsCount('25')
    await this.clickContinue()
    await this.enterBerkshirePigsCount('25')
    await this.clickContinue()
    await this.enterOtherPigsCount('25')
    await this.clickContinue()
    await this.clickContinue()
    await this.clickSend()

    // Get the reference number from confirmation page
    return await this.getReferenceNumber()
  }

  async navigateToApplicationPage(referenceNumber) {
    await this.navigateToCasesPage()
    await this.clickReferenceNumberInTable(referenceNumber)
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

  async acceptApplicationForAssessment() {
    await this.clickTasksTab()
    await this.clickAcceptButton()
  }

  async verifyStageIs() {
    const heading = await $('[data-testid="stage-heading"]')
    return await heading.getText()
  }

  async verifyTaskSections(expectedSections) {
    for (const section of expectedSections) {
      let sectionHeading
      if (section.includes('Check Application')) {
        sectionHeading = await $('h3.govuk-heading-m=1. Check Application')
      } else if (section.includes('Registration Checks')) {
        sectionHeading = await $('h3.govuk-heading-m=2. Registration checks')
      } else {
        sectionHeading = await $(`h3.govuk-heading-m

        =
        ${section}`)
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

    // Generate the task ID from the task name based on known mappings
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
        // Fallback to generic transformation
        taskId = taskName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[()]/g, '')
        break
    }

    await this.checkTaskCheckbox(taskId)
    await this.clickSaveAndContinue()
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

  async verifySuccessfulApproval() {
    // This could check for a success message or confirmation
    // For now, we'll just verify the Contracted stage is reached
    return await this.isContractedStageDisplayed()
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

export default new PigFarmerPage()
