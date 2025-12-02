import BasePage from '../page-objects/base.page.js'

class TasksPage extends BasePage {
  async approvalNotes(actionCode) {
    const selector = `#${actionCode.toUpperCase()}-comment`
    const commentBox = await $(selector)

    await commentBox.waitForDisplayed()
    await commentBox.setValue(`#${actionCode}-comment`)
  }

  async acceptedNotes(notes) {
    const commentBox = await $('#comment')
    await commentBox.setValue(notes)
  }
}

export default new TasksPage()
