import BasePage from '../page-objects/base.page.js'

class UserRolesPage extends BasePage {
  get userInfoText() {
    return $('//p[contains(@class, "body") and contains(text(), "User:")]')
  }

  async getDisplayedUserName() {
    const text = await this.userInfoText.getText()

    return text.replace('User:', '').trim()
  }

  async getPreSelectedRoles() {
    const checked = await $$('input[name="roles"]:checked')

    const roles = []
    for (const checkbox of checked) {
      roles.push(await checkbox.getValue())
    }

    return roles
  }

  async assertPreSelectedRoles(expected = []) {
    const actual = await this.getPreSelectedRoles()

    if (expected.length === 0) {
      await expect(actual).toEqual([])
      return
    }
    await expect(actual.sort()).toEqual(expected.sort())
  }

  async assertPreSelectedUser(expected) {
    const actualUserName = await this.getDisplayedUserName()
    console.log(expected)
    console.log('**********************')
    console.log(actualUserName)
    console.log('**********************')
    console.log(expected.name)
    await expect(actualUserName).toEqual(expected.name)
  }
}

export default new UserRolesPage()
