import BasePage from '../page-objects/base.page.js'

class RolesPage extends BasePage {
  /**
   * Get a row element by role code
   * @param {string} roleCode
   */
  roleRow(roleCode) {
    return $(
      `//tr[.//th/a[normalize-space(text())="${roleCode.toUpperCase()}"]]`
    )
  }

  // All role rows
  get roleRows() {
    return $$('table tbody tr')
  }

  // All role links
  get roleLinks() {
    return $$('table tbody tr th a')
  }

  /**
   * Selects a random role from the table
   * Returns selected role code
   */
  async selectRandomRole() {
    const links = await this.roleLinks

    if (links.length === 0) {
      throw new Error('No roles found in table')
    }

    const randomIndex = Math.floor(Math.random() * links.length)
    const selectedRole = links[randomIndex]

    const roleCode = await selectedRole.getText()
    await selectedRole.click()

    return roleCode
  }

  /**
   * Get role details (name, description, assignable) from the table row
   * @param {string} roleCode
   */
  async getRoleDetails(roleCode) {
    const row = await this.roleRow(roleCode)
    await row.waitForDisplayed({ timeout: 5000 })

    const roleName = await row.$('th a').getText()
    const description = await row.$('td:nth-child(2)').getText()
    const assignable = await row.$('td:nth-child(3)').getText()

    return {
      roleName: roleName.trim(),
      description: description.trim(),
      assignable: assignable.trim()
    }
  }

  /**
   * Assert that a role exists with expected details
   * @param {object} expected - { code, description, assignable }
   */
  async assertRoleExists(expected) {
    const actual = await this.getRoleDetails(expected.code)

    await expect(actual.roleName).toEqual(expected.code)
    await expect(actual.description).toEqual(expected.description)
    await expect(actual.assignable).toEqual(expected.assignable ? 'Yes' : 'No')
  }

  /**
   * Get description for a role from table by code
   */
  async getDescriptionByCode(code) {
    const row = await $(`//a[normalize-space()="${code}"]/ancestor::tr`)
    return (await row.$('td:nth-child(2)').getText()).trim()
  }

  /**
   * Get assignable value ("Yes"/"No") for role by code
   * @param {string} roleCode
   */
  async getAssignableByCode(roleCode) {
    const row = await this.roleRow(roleCode)
    await row.waitForDisplayed({ timeout: 5000 })
    return (await row.$('td:nth-child(3)').getText()).trim()
  }
}

export default new RolesPage()
