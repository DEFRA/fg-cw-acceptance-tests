import BasePage from '../page-objects/base.page.js'

class TasksPage extends BasePage {
  async approvalNotes() {
    const commentBox = await $('#approve-comment')
    await commentBox.setValue('This is my approval comment.')
  }

  async waitForLink(linkText, timeout = 30000, interval = 3000) {
    await browser.waitUntil(
      async () => {
        await browser.refresh()
        const link = await $(`//a[normalize-space(.)="${linkText}"]`)
        return await link.isDisplayed()
      },
      {
        timeout,
        interval,
        timeoutMsg: `Link "${linkText}" not found after ${timeout}ms`
      }
    )

    return await $(`//a[normalize-space(.)="${linkText}"]`)
  }
}

export default new TasksPage()
