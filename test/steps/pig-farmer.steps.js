import { Given, Then, When } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import PigFarmerPage from '../page-objects/pig-farmer.page.js'

let referenceNumber

Given(
  'the user is on grants UI and starts the application at {string}',
  async (path) => {
    await browser.url(`https://grants-ui.dev.cdp-int.defra.cloud/${path}`)
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
    await expect(referenceNumber).toMatch(
      /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/
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

// Export reference number for use in other steps
export { referenceNumber }
