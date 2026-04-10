export async function grantsLogin(username, password) {
  const usernameInput = await $('#crn')
  const passwordInput = await $('#password')
  const signInButton = await $('#submit')

  await usernameInput.waitForDisplayed({ timeout: 10000 })
  await usernameInput.setValue(username)

  await passwordInput.waitForDisplayed({ timeout: 10000 })
  await passwordInput.setValue(password)

  await signInButton.waitForClickable({ timeout: 10000 })
  await signInButton.click()

  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl()
      return !url.includes('login')
    },
    {
      timeout: 15000,
      timeoutMsg: 'Grants login did not complete successfully'
    }
  )
}
