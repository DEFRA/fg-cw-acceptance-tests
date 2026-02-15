import BasePage from '../page-objects/base.page.js'
class EditRolePage extends BasePage {
  get descriptionInput() {
    return $('#description')
  }

  get confirmButton() {
    return $('button=Confirm')
  }

  get assignableYesRadio() {
    return $('#assignable')
  }

  get assignableNoRadio() {
    return $('#assignable-2')
  }

  async clearDescriptionInput() {
    await this.descriptionInput.clearValue()
  }

  async updateDescription(description) {
    const descriptionToUse = description?.trim()
      ? description
      : `AutoDesc_${Math.random().toString(36).substring(2, 8)}`

    await this.descriptionInput.waitForDisplayed()
    await this.descriptionInput.clearValue()
    await this.descriptionInput.setValue(descriptionToUse)
    await this.confirmButton.click()

    return descriptionToUse
  }

  async getDescriptionValue() {
    return (await this.descriptionInput.getValue()).trim()
  }

  async assertDescriptionUpdated(expected) {
    const actual = await this.getDescriptionValue()
    await expect(actual).toEqual(expected)
  }

  async assertEmptyDescriptionError() {
    const pageText = await $('body').getText()

    await expect(pageText).toContain('There is a problem')
    await expect(pageText).toContain('Description is required')
  }

  async assertEditRolePageLoaded(roleCode) {
    const headingText = await this.getHeaderText()

    await expect(headingText).toEqual(`Update ${roleCode}`)
  }

  /**
   * Set "Allow this role to be assigned?" to Yes/No
   * @param {"Yes"|"No"} value
   */
  async setAssignable(value) {
    const normalized = (value || '').toString().trim().toLowerCase()

    if (normalized === 'yes') {
      await this.assignableYesRadio.click()
    } else if (normalized === 'no') {
      await this.assignableNoRadio.click()
    } else {
      throw new Error(`Invalid assignable value "${value}". Use "Yes" or "No".`)
    }
  }

  async confirmUpdate() {
    await this.confirmButton.click()
  }
}

export default new EditRolePage()
