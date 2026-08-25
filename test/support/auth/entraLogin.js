export async function entraLogin(username, password, options = {}) {
  const {
    applicationUrl,
    expectedUrlIncludes = '/',
    maxAttempts = 3,
    loginTimeout = 15000,
    postLoginTimeout = 30000
  } = options

  if (!applicationUrl) {
    throw new Error('entraLogin requires applicationUrl in the options')
  }

  console.log(`Starting Entra login for: ${username}`)
  console.log(`Application URL: ${applicationUrl}`)

  const microsoftHosts = ['login.microsoftonline.com', 'login.live.com']

  const isMicrosoftLoginUrl = async () => {
    try {
      const url = await browser.getUrl()

      return microsoftHosts.some((host) => url.includes(host))
    } catch {
      return false
    }
  }

  const isDisplayedSafe = async (selector) => {
    try {
      const element = await $(selector)

      return (await element.isExisting()) && (await element.isDisplayed())
    } catch {
      return false
    }
  }

  const clickWhenReady = async (selector) => {
    const element = await $(selector)

    await element.waitForDisplayed({
      timeout: loginTimeout
    })

    await element.waitForEnabled({
      timeout: loginTimeout
    })

    await element.click()
  }

  const typeWhenReady = async (selector, value) => {
    const element = await $(selector)

    await element.waitForDisplayed({
      timeout: loginTimeout
    })

    await element.waitForEnabled({
      timeout: loginTimeout
    })

    await element.click()
    await element.clearValue()
    await element.setValue(value)
  }

  const waitForPasswordField = async () => {
    await browser.waitUntil(
      async () => {
        return await isDisplayedSafe('#i0118')
      },
      {
        timeout: loginTimeout,
        interval: 500,
        timeoutMsg: 'Password field did not appear after entering username'
      }
    )
  }

  const handleStaySignedInPromptIfPresent = async () => {
    try {
      if (!(await isDisplayedSafe('#idSIButton9'))) {
        return
      }

      const currentUrl = await browser.getUrl()

      if (microsoftHosts.some((host) => currentUrl.includes(host))) {
        console.log('Handling "Stay signed in?" prompt')

        await clickWhenReady('#idSIButton9')
      }
    } catch (error) {
      console.log(`No "Stay signed in?" prompt displayed: ${error.message}`)
    }
  }

  const hasReachedApp = async () => {
    try {
      const url = await browser.getUrl()

      const stillOnMicrosoft = microsoftHosts.some((host) => url.includes(host))

      if (stillOnMicrosoft) {
        return false
      }

      return url.includes(expectedUrlIncludes)
    } catch {
      return false
    }
  }

  const waitForApplication = async () => {
    await browser.waitUntil(async () => await hasReachedApp(), {
      timeout: postLoginTimeout,
      interval: 1000,
      timeoutMsg: `Entra login did not complete - expected URL to include "${expectedUrlIncludes}"`
    })
  }

  const performLoginAttempt = async () => {
    const currentUrl = await browser.getUrl()

    console.log(`Current URL before login attempt: ${currentUrl}`)

    /*
     * Username page
     */
    if (await isDisplayedSafe('#i0116')) {
      console.log('Entering Entra username')

      await typeWhenReady('#i0116', username)

      await clickWhenReady('#idSIButton9')
    }

    /*
     * Password page
     */
    await waitForPasswordField()

    if (await isDisplayedSafe('#i0118')) {
      console.log('Entering Entra password')

      await typeWhenReady('#i0118', password)

      await clickWhenReady('#idSIButton9')
    }

    /*
     * Give Entra a moment to process the login.
     */
    await browser.pause(1000)

    /*
     * Handle "Stay signed in?"
     */
    await handleStaySignedInPromptIfPresent()

    /*
     * Do NOT just assume that leaving Microsoft means login succeeded.
     * Wait until the actual application URL is reached.
     */
    await waitForApplication()
  }

  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Entra login attempt ${attempt}/${maxAttempts}`)

      /*
       * Only navigate to the application on the first attempt.
       */
      if (attempt === 1) {
        console.log(`Navigating to application: ${applicationUrl}`)

        await browser.url(applicationUrl)
      }

      await performLoginAttempt()

      /*
       * Final verification.
       */
      const successful = await hasReachedApp()

      if (!successful) {
        throw new Error(
          `Login finished but application URL was not reached. Expected URL to include "${expectedUrlIncludes}"`
        )
      }

      console.log(`Entra login successful for ${username}`)

      return
    } catch (error) {
      lastError = error

      let currentUrl = 'unknown'

      try {
        currentUrl = await browser.getUrl()
      } catch {
        // Ignore getUrl failure
      }

      console.log(`Entra login attempt ${attempt} failed: ${error.message}`)

      console.log(`Current URL after failure: ${currentUrl}`)

      if (attempt === maxAttempts) {
        break
      }

      /*
       * Recovery before the next attempt.
       */
      try {
        if (await isMicrosoftLoginUrl()) {
          console.log('Still on Microsoft login page - refreshing')

          await browser.refresh()
        } else {
          console.log(
            'Not on Microsoft login page - navigating to application again'
          )

          await browser.url(applicationUrl)
        }
      } catch (recoveryError) {
        console.log(`Recovery action failed: ${recoveryError.message}`)

        /*
         * If recovery failed, try a clean navigation.
         */
        try {
          await browser.url(applicationUrl)
        } catch (navigationError) {
          console.log(`Navigation recovery failed: ${navigationError.message}`)
        }
      }

      await browser.pause(2000)
    }
  }

  throw new Error(
    `Entra login failed after ${maxAttempts} attempts. ` +
      `Last error: ${lastError?.message || 'Unknown error'}`
  )
}
