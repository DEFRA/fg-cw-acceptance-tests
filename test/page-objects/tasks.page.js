import BasePage from '../page-objects/base.page.js'

class TasksPage extends BasePage {
  async approvalNotes() {
    const commentBox = await $('#approve-comment')
    await commentBox.setValue('This is my approval comment.')
  }
}

export default new TasksPage()
