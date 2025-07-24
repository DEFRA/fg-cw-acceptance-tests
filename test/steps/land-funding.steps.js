import { Given, When, Then } from '@wdio/cucumber-framework'
import { expect } from '@wdio/globals'
import LandFundingPage from '../page-objects/land-funding.page.js'
import { setReferenceNumber, setApplicationType } from '../utils/shared-data.js'

let referenceNumber

Given(
  'a Land Funding application has been submitted by an applicant',
  async () => {
    referenceNumber = await LandFundingPage.submitCompleteApplication()
    setReferenceNumber(referenceNumber) // Store in shared data
    setApplicationType('land-funding') // Store application type
    console.log(
      `Land funding application submitted with reference number: ${referenceNumber}`
    )
  }
)

Given('the user is on the land funding application page', async () => {
  await LandFundingPage.navigateToApplication()
  console.log('Navigated to land funding application page')
})

When('the user starts the application', async () => {
  await LandFundingPage.clickStartNow()
  console.log('Clicked Start Now button')
})

When('the user confirms their details', async () => {
  await LandFundingPage.clickContinue()
  console.log('Confirmed user details')
})

When('the user confirms their land details are correct', async () => {
  await LandFundingPage.confirmLandDetailsCorrect()
  await LandFundingPage.clickContinue()
  console.log('Confirmed land details are correct')
})

When(
  'the user enters the agreement name as {string}',
  async (agreementName) => {
    await LandFundingPage.enterAgreementName(agreementName)
    await LandFundingPage.clickContinue()
    console.log(`Entered agreement name: ${agreementName}`)
  }
)

When('the user selects land parcel {string}', async (landParcel) => {
  await LandFundingPage.selectLandParcel()
  await LandFundingPage.clickContinue()
  console.log(`Selected land parcel: ${landParcel}`)
})

When(
  'the user selects the CMOR1 action with quantity {string}',
  async (quantity) => {
    await LandFundingPage.selectAction()
    await LandFundingPage.enterQuantity(quantity)
    await LandFundingPage.clickContinue()
    console.log(`Selected CMOR1 action with quantity: ${quantity}`)
  }
)

When('the user chooses not to add more actions', async () => {
  await LandFundingPage.selectNoMoreActions()
  await LandFundingPage.clickContinue()
  console.log('Selected not to add more actions')
})

Then(
  'the user should see the correct application summary with:',
  async (dataTable) => {
    const expectedData = {}
    const rows = dataTable.raw()

    for (const [key, value] of rows) {
      expectedData[key] = value
    }

    await LandFundingPage.verifyApplicationSummary(expectedData)
    console.log('Verified application summary data')
  }
)

When('the user submits the land funding application', async () => {
  await LandFundingPage.clickContinue() // Continue from summary page
  await LandFundingPage.submitApplication()
  console.log('Submitted the land funding application')
})

Then(
  'the user should see the land funding application confirmation page with reference number',
  async () => {
    const isConfirmationDisplayed =
      await LandFundingPage.isConfirmationPageDisplayed()
    await expect(isConfirmationDisplayed).toBe(true)

    referenceNumber = await LandFundingPage.getReferenceNumber()
    console.log(
      `Land funding application submitted with reference number: ${referenceNumber}`
    )
  }
)

Then(
  'the reference number should be in the format {string}',
  async (expectedFormat) => {
    const isValidFormat =
      await LandFundingPage.verifyReferenceNumberFormat(referenceNumber)
    await expect(isValidFormat).toBe(true)
    console.log(`Reference number ${referenceNumber} matches expected format`)
  }
)

// Note: Caseworker steps are shared and defined in pig-farmer.steps.js
// They work across different grant applications by using the exported referenceNumber

// Export reference number for use in other steps
export { referenceNumber }
