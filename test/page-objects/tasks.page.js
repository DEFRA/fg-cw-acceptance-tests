import BasePage from '../page-objects/base.page.js'
import { getRequest } from '../page-objects/apiHelper.js'

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

  async waitForApplicationStatusApi({
    code,
    clientRef,
    expected,
    timeout = 60000,
    interval = 3000
  }) {
    let lastStatusCode
    let lastBody
    let lastReason = ''

    await browser.waitUntil(
      async () => {
        try {
          const apiResponse = await getRequest(
            `${code}/applications/${clientRef}/status`
          )

          lastStatusCode = apiResponse?.statusCode
          lastBody = apiResponse?.body

          console.log('Application status API response:', lastBody)
          console.log('*******************')

          if (lastStatusCode !== 200) {
            lastReason = `statusCode=${lastStatusCode}`
            return false
          }

          const body = lastBody
          const actual = Array.isArray(body) ? body[0] : body

          if (!actual) {
            lastReason = 'empty body'
            return false
          }

          if (expected.clientRef && actual.clientRef !== clientRef) {
            lastReason = `clientRef mismatch expected "${clientRef}" received "${actual.clientRef}"`
            return false
          }

          for (const key of Object.keys(expected)) {
            if (key === 'clientRef') continue

            const actualValue = actual[key]
            const actualStr =
              actualValue === undefined || actualValue === null
                ? ''
                : String(actualValue)

            if (actualStr !== expected[key]) {
              lastReason = `key "${key}" expected "${expected[key]}" received "${actualStr}"`
              return false
            }
          }

          return true
        } catch (error) {
          lastReason = `request failed: ${error.message}`
          lastStatusCode = undefined
          lastBody = undefined
          return false
        }
      },
      {
        timeout,
        interval,
        timeoutMsg:
          `Application status API did not match expected values in time.\n` +
          `clientRef: ${clientRef}\n` +
          `Last reason: ${lastReason}\n` +
          `Last statusCode: ${lastStatusCode}\n` +
          `Last body: ${await this.safeStringify(lastBody)}`
      }
    )
  }

  async safeStringify(obj) {
    try {
      return JSON.stringify(obj)
    } catch {
      return String(obj)
    }
  }
}

export default new TasksPage()
