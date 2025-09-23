import { Given, Then, When } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import PigFarmerPage from '../page-objects/pig-farmer.page.js'
import LandFundingPage from '../page-objects/land-funding.page.js'
import {
  setReferenceNumber,
  getReferenceNumber,
  setApplicationType,
  getApplicationType
} from '../utils/shared-data.js'

let referenceNumber

Given(
  'the user is on grants UI and starts the application at {string}',
  async (path) => {
    const environment = process.env.ENVIRONMENT || 'dev'
    await browser.url(
      `https://grants-ui.${environment}.cdp-int.defra.cloud/${path}`
    )
    await PigFarmerPage.clickStartNow()
  }
)

When('the user submits the answers', async () => {
  // Step 1: Select yes for pig farmer question
  await PigFarmerPage.selectPigFarmerYes()
  await PigFarmerPage.clickContinue()

  // Step 2: Enter total number of pigs
  await PigFarmerPage.enterTotalPigs('100')
  await PigFarmerPage.clickContinue()

  // Step 3: Select all pig breeds
  await PigFarmerPage.selectAllPigBreeds()
  await PigFarmerPage.clickContinue()

  // Step 4: Enter white pigs count
  await PigFarmerPage.enterWhitePigsCount('25')
  await PigFarmerPage.clickContinue()

  // Step 5: Enter British Landrace pigs count
  await PigFarmerPage.enterBritishLandracePigsCount('25')
  await PigFarmerPage.clickContinue()

  // Step 6: Enter Berkshire pigs count
  await PigFarmerPage.enterBerkshirePigsCount('25')
  await PigFarmerPage.clickContinue()

  // Step 7: Enter other pigs count
  await PigFarmerPage.enterOtherPigsCount('25')
  await PigFarmerPage.clickContinue()

  // Step 8: Continue on potential funding page
  await PigFarmerPage.clickContinue()
})

When('the user submits the application', async () => {
  // Click send on 'check your answers' page
  await PigFarmerPage.clickSend()
})

Then(
  'the user should see the confirmation page with reference number',
  async () => {
    // Verify confirmation page is displayed
    const isConfirmationDisplayed =
      await PigFarmerPage.isConfirmationPageDisplayed()
    await expect(isConfirmationDisplayed).toBe(true)

    // Retrieve and store reference number
    referenceNumber = await PigFarmerPage.getReferenceNumber()
    setReferenceNumber(referenceNumber) // Store in shared data
    setApplicationType('pig-farmer') // Store application type
    await expect(referenceNumber).toMatch(
      /^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/
    )

    console.log(
      `Application submitted with reference number: ${referenceNumber}`
    )
  }
)

When('the user navigates to the cases page', async () => {
  await PigFarmerPage.navigateToCasesPage()
})

Then(
  'the user should see the submitted application in the cases table',
  async () => {
    // Verify that the reference number appears in the cases table
    const isReferenceInTable =
      await PigFarmerPage.isReferenceNumberInTable(referenceNumber)
    await expect(isReferenceInTable).toBe(true)

    console.log(`Reference number ${referenceNumber} found in cases table`)
  }
)

When(
  'the user clicks on the reference number to open the application',
  async () => {
    // Use the inherited clickLinkByText method from BasePage
    await PigFarmerPage.clickLinkByText(referenceNumber)
    console.log(
      `Clicked on reference number ${referenceNumber} and navigated to application page`
    )
  }
)

When('the user clicks on the Case Details tab', async () => {
  await PigFarmerPage.clickLinkByText('Case Details')
  console.log('Clicked on Case Details tab')
})

Then(
  'the user should see the submitted answers match the earlier submission',
  async () => {
    await PigFarmerPage.verifySubmittedAnswers()
    console.log('Verified submitted answers match the earlier submission')
  }
)

When('the user clicks on the Tasks tab', async () => {
  await PigFarmerPage.clickTasksTab()
  console.log('Clicked on Tasks tab')
})

When('the user clicks on the Accept button', async () => {
  await PigFarmerPage.clickAcceptButton()
  console.log('Clicked on Accept button')
})

Then('the user should see the Assessment stage', async () => {
  const isAssessmentDisplayed = await PigFarmerPage.isAssessmentStageDisplayed()
  await expect(isAssessmentDisplayed).toBe(true)
  console.log('Assessment stage is displayed')
})

Then(
  'the user should see Check Application and Registration checks sections',
  async () => {
    const sectionsDisplayed = await PigFarmerPage.verifyAssessmentSections()
    await expect(sectionsDisplayed).toBe(true)
    console.log(
      'Check Application and Registration checks sections are displayed'
    )
  }
)

When('the user clicks on {string} task', async (taskName) => {
  await PigFarmerPage.clickTaskLink(taskName)
  console.log(`Clicked on task: ${taskName}`)
})

When('the user checks the checkbox for {string}', async (taskId) => {
  await PigFarmerPage.checkTaskCheckbox(taskId)
  console.log(`Checked checkbox for task: ${taskId}`)
})

When('the user clicks on Save and Continue button', async () => {
  await PigFarmerPage.clickSaveAndContinue()
  console.log('Clicked on Save and Continue button')
})

Then(
  'the task {string} should have status {string}',
  async (taskName, expectedStatus) => {
    const statusMatches = await PigFarmerPage.verifyTaskStatus(
      taskName,
      expectedStatus
    )
    await expect(statusMatches).toBe(true)
    console.log(`Task "${taskName}" has status: ${expectedStatus}`)
  }
)

When('the user clicks on Confirm Approval button', async () => {
  await PigFarmerPage.clickConfirmApproval()
  console.log('Clicked on Confirm Approval button')
})

Then('the user should see the Contracted stage', async () => {
  const isContractedDisplayed = await PigFarmerPage.isContractedStageDisplayed()
  await expect(isContractedDisplayed).toBe(true)
  console.log('Contracted stage is displayed')
})

// Refactored step definitions for caseworker perspective
Given(
  'a Flying Pigs application has been submitted by an applicant',
  async () => {
    referenceNumber = await PigFarmerPage.submitApplication()
    setReferenceNumber(referenceNumber) // Store in shared data
    setApplicationType('pig-farmer') // Store application type
    console.log(
      `Application submitted with reference number: ${referenceNumber}`
    )
  }
)

Given('I am signed in as a caseworker', async () => {
  // This step can be implemented when authentication is required
  // For now, we assume the user is already authenticated
  console.log('Caseworker is signed in')
})

When('I navigate to the Cases page', async () => {
  await PigFarmerPage.navigateToCasesPage()
  console.log('Navigated to Cases page')
})

Then('I should see the submitted application listed', async () => {
  const currentRef = getReferenceNumber()
  const isReferenceInTable = await PigFarmerPage.waitUntilVisible(currentRef)
  // const isReferenceInTable =
  //   await PigFarmerPage.isReferenceNumberInTable(currentRef)
  await expect(isReferenceInTable).toBe(true)
  console.log(`Reference number ${currentRef} found in cases table`)
})

When('I open the submitted application', async () => {
  const currentRef = getReferenceNumber()
  await PigFarmerPage.clickLinkByText(currentRef)
  console.log(`Opened application with reference number: ${currentRef}`)
})

When('I view the Case Details', async () => {
  await PigFarmerPage.clickLinkByText('Case Details')
})

Then('I should see the answers submitted by the applicant', async () => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.verifySubmittedAnswers()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.verifySubmittedAnswers()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log('Verified submitted answers match the earlier submission')
})

When('I complete the Review application data task', async () => {
  // First navigate to the Tasks tab
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.clickTasksTab()
    await PigFarmerPage.completeReviewApplicationDataTask()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.clickTasksTab()
    await LandFundingPage.completeReviewApplicationDataTask()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log('Completed Review application data task')
})

When('I accept the application for assessment', async () => {
  await PigFarmerPage.acceptApplicationForAssessment()
  console.log('Accepted application for assessment')
})

When('I approve the application for assessment', async () => {
  await PigFarmerPage.approveApplicationForAssessment()
  console.log('Approved application for assessment')
})

Then('the case stage should be updated to {string}', async (expectedStage) => {
  const stageMatches = await PigFarmerPage.verifyStageIs(expectedStage)
  await expect(stageMatches).toBe(true)
  console.log(`Case stage is: ${expectedStage}`)
})

Then('I should see the following task sections:', async (dataTable) => {
  const sections = dataTable.raw().map((row) => row[0])
  await PigFarmerPage.verifyTaskSections(sections)
  console.log(`Verified task sections: ${sections.join(', ')}`)
})

When('I complete the task {string}', async (taskName) => {
  await PigFarmerPage.completeTask(taskName)
  console.log(`Completed task: ${taskName}`)
})

Then('all tasks should show status {string}', async (expectedStatus) => {
  await PigFarmerPage.verifyAllTasksComplete()
  console.log(`All tasks have status: ${expectedStatus}`)
})

When('I {string} the application', async (text) => {
  await PigFarmerPage.clickButtonByText(text)
  console.log('Approved the application')
})

When('I confirm the decision as approval of the application', async () => {
  await PigFarmerPage.approveTheDecision()
  console.log('Approved the application')
})

Then('I should see a confirmation of successful approval', async () => {
  const approvalConfirmed = await PigFarmerPage.verifySuccessfulApproval()
  await expect(approvalConfirmed).toBe(true)
  console.log('Confirmed successful approval')
})

When('I view the Timeline', async () => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.clickTimelineTab()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.clickTimelineTab()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log('Navigated to Timeline tab')
})

Then('I should see a timeline item for {string}', async (itemType) => {
  const applicationType = getApplicationType()
  let itemExists
  if (applicationType === 'pig-farmer') {
    itemExists = await PigFarmerPage.verifyTimelineItemExists(itemType)
  } else if (applicationType === 'land-funding') {
    itemExists = await LandFundingPage.verifyTimelineItemExists(itemType)
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  await expect(itemExists).toBe(true)
  console.log(`Verified timeline item exists: ${itemType}`)
})

Then(
  'I should see {int} timeline items for {string}',
  async (expectedCount, itemType) => {
    const applicationType = getApplicationType()
    if (applicationType === 'pig-farmer') {
      await PigFarmerPage.verifyTimelineItem(itemType, expectedCount)
    } else if (applicationType === 'land-funding') {
      await LandFundingPage.verifyTimelineItem(itemType, expectedCount)
    } else {
      throw new Error(`Unknown application type: ${applicationType}`)
    }
    console.log(`Verified ${expectedCount} timeline items for: ${itemType}`)
  }
)

Then(
  'the latest timeline item should be {string}',
  async (expectedItemType) => {
    const applicationType = getApplicationType()
    let isLatest
    if (applicationType === 'pig-farmer') {
      isLatest = await PigFarmerPage.verifyLatestTimelineItem(expectedItemType)
    } else if (applicationType === 'land-funding') {
      isLatest =
        await LandFundingPage.verifyLatestTimelineItem(expectedItemType)
    } else {
      throw new Error(`Unknown application type: ${applicationType}`)
    }
    await expect(isLatest).toBe(true)
    console.log(`Verified latest timeline item is: ${expectedItemType}`)
  }
)

When('I return to the Tasks tab', async () => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.clickTasksTab()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.clickTasksTab()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log('Returned to Tasks tab')
})

// New improved step definitions for better cucumber syntax
When('I complete the {string} task', async (taskName) => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.clickTasksTab()
    await PigFarmerPage.completeReviewApplicationDataTask()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.clickTasksTab()
    await LandFundingPage.completeReviewApplicationDataTask()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log(`Completed task: ${taskName}`)
})

Then(
  'the timeline should show the latest item {string}',
  async (expectedItemType) => {
    const applicationType = getApplicationType()
    if (applicationType === 'pig-farmer') {
      await PigFarmerPage.clickTimelineTab()
      const isLatest =
        await PigFarmerPage.verifyLatestTimelineItem(expectedItemType)
      await expect(isLatest).toBe(true)
    } else if (applicationType === 'land-funding') {
      await LandFundingPage.clickTimelineTab()
      const isLatest =
        await LandFundingPage.verifyLatestTimelineItem(expectedItemType)
      await expect(isLatest).toBe(true)
    } else {
      throw new Error(`Unknown application type: ${applicationType}`)
    }
    console.log(`Verified latest timeline item is: ${expectedItemType}`)
  }
)

Then('the case stage should be {string}', async (expectedStage) => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    const actualStage = await PigFarmerPage.verifyStageIs()
    await expect(actualStage).toBe(expectedStage)
  } else if (applicationType === 'land-funding') {
    const stageMatches = await LandFundingPage.verifyStageIs(expectedStage)
    await expect(stageMatches).toBe(true)
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log(`Case stage is: ${expectedStage}`)
})

When('I view the tasks for the case', async () => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.clickTasksTab()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.clickTasksTab()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log('Viewing tasks for the case')
})

When('I complete all of the following tasks:', async (dataTable) => {
  const tasks = dataTable.raw().map((row) => row[0])
  const applicationType = getApplicationType()

  for (const taskName of tasks) {
    if (applicationType === 'pig-farmer') {
      await PigFarmerPage.completeTask(taskName)
    } else if (applicationType === 'land-funding') {
      await LandFundingPage.completeTask(taskName)
    } else {
      throw new Error(`Unknown application type: ${applicationType}`)
    }
    console.log(`Completed task: ${taskName}`)
  }
})

Then('all tasks should have status {string}', async (expectedStatus) => {
  const applicationType = getApplicationType()
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.verifyAllTasksComplete()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.verifyAllTasksComplete()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }
  console.log(`All tasks have status: ${expectedStatus}`)
})

Then('the timeline should show:', async (dataTable) => {
  const expectedItems = dataTable.raw()
  const applicationType = getApplicationType()

  // Navigate to timeline tab
  if (applicationType === 'pig-farmer') {
    await PigFarmerPage.clickTimelineTab()
  } else if (applicationType === 'land-funding') {
    await LandFundingPage.clickTimelineTab()
  } else {
    throw new Error(`Unknown application type: ${applicationType}`)
  }

  // Verify each timeline item count
  for (const [itemType, expectedCount] of expectedItems) {
    const count = parseInt(expectedCount)
    if (applicationType === 'pig-farmer') {
      await PigFarmerPage.verifyTimelineItem(itemType, count)
    } else if (applicationType === 'land-funding') {
      await LandFundingPage.verifyTimelineItem(itemType, count)
    } else {
      throw new Error(`Unknown application type: ${applicationType}`)
    }
    console.log(`Verified ${count} timeline items for: ${itemType}`)
  }
})

// Export reference number for use in other steps
export { referenceNumber }
