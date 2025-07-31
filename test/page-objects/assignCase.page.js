import BasePage from '../page-objects/base.page.js'
import { generatedClientRef } from '../page-objects/apiHelper.js'

class AssignCasePage extends BasePage {
  async selectRandomUser() {
    const options = await $$('select#assignedUserId option:not([value=""])')
    const randomIndex = Math.floor(Math.random() * options.length)
    console.log(`Random index: ${randomIndex} of ${options.length - 1}`)
    const randomOption = options[randomIndex]
    const selectedUserText = await randomOption.getText()
    const selectedUserValue = await randomOption.getAttribute('value')
    console.log(
      `Selected user: ${selectedUserText} (value: ${selectedUserValue})`
    )
    await $('#assignedUserId').selectByAttribute('value', selectedUserValue)
    console.log(`Selected user: ${selectedUserText}`)
    this.selectedUserText = selectedUserText
  }

  async getConfirmedUser() {
    const banner = await $('.govuk-notification-banner__content')
    await banner.waitForDisplayed()

    const heading = await $('.govuk-notification-banner__heading')
    const headingText = await heading.getText()
    expect(headingText).toEqual('Case assigned successfully')
    const bodyText = await $('<p>').getText()
    console.log('bodyText:', bodyText)
    console.log('Expected user:', this.selectedUserText)
    expect(bodyText).toEqual(
      'Case ' +
        generatedClientRef +
        ' has been assigned to ' +
        this.selectedUserText
    )
  }
}

export default new AssignCasePage()
