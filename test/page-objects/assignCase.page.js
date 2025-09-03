import BasePage from '../page-objects/base.page.js'

class AssignCasePage extends BasePage {
  get userDropdown() {
    return $('#assignedUserId')
  }

  get notesField() {
    return $('#notes')
  }

  async enterNotes() {
    const randomText = `Note-${Math.random().toString(36).substring(2, 8)}`
    await this.notesField.setValue(randomText)
    return randomText
  }

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
    await this.userDropdown.selectByAttribute('value', selectedUserValue)
    console.log(`Selected user: ${selectedUserText}`)
    return selectedUserText
  }

  async selectUnassignedUser() {
    const unassignedValue = ''
    await this.userDropdown.selectByAttribute('value', unassignedValue)

    const selectedText = await this.userDropdown.getText()
    console.log(`Selected Unassigned option: "${selectedText}"`)

    return selectedText
  }

  async getConfirmedUser() {
    const banner = await $('.govuk-notification-banner__content')
    await banner.waitForDisplayed()

    const heading = await $('.govuk-notification-banner__heading')
    const headingText = await heading.getText()
    expect(headingText).toEqual('Case assigned successfully')
    return await $('<p>').getText()
  }
}

export default new AssignCasePage()
