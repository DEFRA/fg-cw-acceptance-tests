export async function entraLogin(username, password, options = {}) {
  const {
    expectedUrlIncludes = '/',
    maxAttempts = 3,
    loginTimeout = 15000,
    postLoginTimeout = 30000
  } = options

  console.log(`Starting Entra login for: ${username}`)

  const microsoftHosts = ['login.microsoftonline.com', 'login.live.com']

  const isMicrosoftLoginUrl = async () => {
    const url = await browser.getUrl()
    return microsoftHosts.some((host) => url.includes(host))
  }

  const isDisplayedSafe = async (selector) => {
    try {
      const el = await $(selector)
      return (await el.isExisting()) && (await el.isDisplayed())
    } catch {
      return false
    }
  }

  const clickWhenReady = async (selector) => {
    const el = await $(selector)
    await el.waitForDisplayed({ timeout: loginTimeout })
    await el.waitForEnabled({ timeout: loginTimeout })
    await el.click()
  }

  const typeWhenReady = async (selector, value) => {
    const el = await $(selector)
    await el.waitForDisplayed({ timeout: loginTimeout })
    await el.waitForEnabled({ timeout: loginTimeout })
    await el.click()
    await el.clearValue()
    await el.setValue(value)
  }

  const waitForPasswordField = async () => {
    await browser.waitUntil(async () => await isDisplayedSafe('#i0118'), {
      timeout: loginTimeout,
      interval: 500,
      timeoutMsg: 'Password field did not appear after entering username'
    })
  }

  const handleStaySignedInPromptIfPresent = async () => {
    try {
      if (await isDisplayedSafe('#idSIButton9')) {
        const currentUrl = await browser.getUrl()

        if (microsoftHosts.some((host) => currentUrl.includes(host))) {
          console.log('Handling "Stay signed in?" prompt')
          await clickWhenReady('#idSIButton9')
        }
      }
    } catch {
      console.log('No "Stay signed in?" prompt displayed')
    }
  }

  const hasReachedApp = async () => {
    const url = await browser.getUrl()
    const stillOnMicrosoft = microsoftHosts.some((host) => url.includes(host))

    if (stillOnMicrosoft) {
      return false
    }

    return url.includes(expectedUrlIncludes)
  }

  const performLoginAttempt = async () => {
    if (await isDisplayedSafe('#i0116')) {
      await typeWhenReady('#i0116', username)
      await clickWhenReady('#idSIButton9')
    }

    await waitForPasswordField()

    if (await isDisplayedSafe('#i0118')) {
      await typeWhenReady('#i0118', password)
      await clickWhenReady('#idSIButton9')
    }

    await browser.pause(1000)
    await handleStaySignedInPromptIfPresent()

    await browser.waitUntil(async () => await hasReachedApp(), {
      timeout: postLoginTimeout,
      interval: 1000,
      timeoutMsg: `Entra login did not complete - expected URL to include "${expectedUrlIncludes}"`
    })
  }

  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Entra login attempt ${attempt}/${maxAttempts}`)
      await performLoginAttempt()

      if (await hasReachedApp()) {
        console.log('Entra login successful')
        return
      }

      throw new Error(
        `Login completed but expected app URL was not reached: ${expectedUrlIncludes}`
      )
    } catch (error) {
      lastError = error
      const currentUrl = await browser.getUrl()

      console.log(
        `Entra login attempt ${attempt} failed: ${error.message}. Current URL: ${currentUrl}`
      )

      if (attempt === maxAttempts) {
        break
      }

      try {
        if (await isMicrosoftLoginUrl()) {
          console.log('Still on Microsoft login page, refreshing before retry')
          await browser.refresh()
        } else {
          console.log('Navigating back to retry login')
          await browser.back()
        }
      } catch {
        console.log('Recovery action failed, continuing with retry')
      }

      await browser.pause(2000)
    }
  }

  throw new Error(
    `Entra login failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
  )
}
