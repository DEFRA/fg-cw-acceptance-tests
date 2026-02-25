import BasePage from '../page-objects/base.page.js'

class UserRolesPage extends BasePage {
  get userInfoText() {
    return $('//p[contains(@class, "body") and contains(text(), "User:")]')
  }

  async getDisplayedUserName() {
    return await this.getHeaderText()
  }

  async getPreSelectedRoles() {
    const checked = await $$('input[name="roles"]:checked')

    if (checked.length === 0) {
      return ['No Manage grants roles have been allocated to this user']
    }

    const roles = []
    for (const checkbox of checked) {
      roles.push(await checkbox.getValue())
    }

    return roles
  }

  async assertPreSelectedRoles(expected = []) {
    const actual = await this.getPreSelectedRoles()
    const normalize = (arr) =>
      arr.map((role) => role.replace(/,$/, '').trim()).sort()

    const normalizedActual = normalize(actual)
    const normalizedExpected = normalize(expected)

    if (normalizedExpected.length === 0) {
      await expect(normalizedActual).toEqual([])
      return
    }
    await expect(normalizedActual).toEqual(normalizedExpected)
  }

  async assertPreSelectedUser(expected) {
    const actualUserName = await this.getDisplayedUserName()
    await expect(actualUserName).toEqual(expected.name + ' roles')
  }

  async isRoleCurrentlyAssigned(roleCode) {
    const roleCheckbox = await $(`input[name="roles"][value="${roleCode}"]`)

    if (!(await roleCheckbox.isExisting())) {
      return false
    }

    return await roleCheckbox.isSelected()
  }

  async assertRoleAvailable(roleCode) {
    const roleCheckbox = await $(`input[name="roles"][value="${roleCode}"]`)

    await expect(roleCheckbox).toBeExisting()
  }

  async assertRoleNotAvailable(roleCode) {
    const roleCheckbox = await $(`input[name="roles"][value="${roleCode}"]`)

    await expect(roleCheckbox).not.toBeExisting()
  }
}

export default new UserRolesPage()
