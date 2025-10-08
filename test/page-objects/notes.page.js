import BasePage from '../page-objects/base.page.js'

class NotesPage extends BasePage {
  get notesField() {
    return $('#text')
  }

  async enterNotes() {
    const randomText = `Note-${Math.random().toString(36).substring(2, 8)}`
    await this.notesField.setValue(randomText)
    return randomText
  }
}

export default new NotesPage()
