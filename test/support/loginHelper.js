import { entraLogin } from '../support/auth/entraLogin.js'
import { grantsLogin } from '../support/auth/grantsLogin.js'
import { getCaseworkingUrl, getGrantsUrl } from './serviceUrls.js'
import {
  getCaseworkerCredentials,
  getGrantsCredentials
} from './credentialsHelper.js'

async function shouldReuseSession(service, username) {
  const currentUser = await browser.sharedStore.get('currentUser')

  return (
    currentUser &&
    currentUser.service === service &&
    currentUser.username === username
  )
}

async function rememberCurrentUser(user) {
  await browser.sharedStore.set('currentUser', user)
}

export async function loginToCaseworking(role = 'writer') {
  const url = getCaseworkingUrl()
  const {
    username,
    password,
    role: resolvedRole
  } = getCaseworkerCredentials(role)

  if (await shouldReuseSession('caseworking', username)) {
    console.log(`Reusing existing Caseworking session for ${username}`)
    await browser.url(url)
    browser.options.baseUrl = url
    return
  }

  await browser.url(url)
  browser.options.baseUrl = url

  await rememberCurrentUser({
    username,
    role: resolvedRole,
    service: 'caseworking'
  })

  console.log(`Logging into Caseworking as ${role}: ${username}`)
  await entraLogin(username, password)
}

export async function loginToGrants() {
  const url = getGrantsUrl()
  const { username, password } = getGrantsCredentials()

  if (await shouldReuseSession('grants', username)) {
    console.log(`Reusing existing Grants session for ${username}`)
    await browser.url(url)
    browser.options.baseUrl = url
    return
  }

  await browser.url(url)
  browser.options.baseUrl = url

  await rememberCurrentUser({
    username,
    service: 'grants'
  })

  console.log(`Logging into Grants as: ${username}`)
  await grantsLogin(username, password)
}
