export async function entraLogin(username, password) {
  console.log(`Starting Entra login for: ${username}`)

  const clickFresh = async (selector, action = 'click', value) => {
    const el = await $(selector)
    await el.waitForDisplayed({ timeout: 15000 })
    await el.waitForEnabled({ timeout: 15000 })

    if (action === 'setValue') {
      await el.click()
      await el.clearValue()
      await el.setValue(value)
    } else {
      await el.click()
    }
  }

  const retry = async (fn, retries = 3) => {
    let lastErr
    for (let i = 0; i < retries; i++) {
      try {
        return await fn()
      } catch (err) {
        lastErr = err
        const msg = String(err?.message || '')
        const isStale = msg.includes('stale element reference')
        if (!isStale || i === retries - 1) {
          throw err
        }
        console.log(`Retrying after stale element (${i + 1}/${retries})`)
      }
    }
    throw lastErr
  }

  await retry(async () => {
    await clickFresh('#i0116', 'setValue', username)
    await clickFresh('#idSIButton9')

    await clickFresh('#i0118', 'setValue', password)
    await clickFresh('#idSIButton9')

    try {
      const staySignedInBtn = await $('#idSIButton9')
      await staySignedInBtn.waitForDisplayed({ timeout: 5000 })
      await staySignedInBtn.waitForEnabled({ timeout: 5000 })
      await staySignedInBtn.click()
    } catch {
      console.log('No "Stay signed in?" prompt displayed')
    }

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl()
        return !url.includes('login.microsoftonline.com')
      },
      {
        timeout: 20000,
        timeoutMsg: 'Entra login did not complete - still on login page'
      }
    )
  })
}
