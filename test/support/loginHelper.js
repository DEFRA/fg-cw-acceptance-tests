import { entraLogin } from '../support/auth/entraLogin.js'
import { grantsLogin } from '../support/auth/grantsLogin.js'
import { getCaseworkingUrl, getGrantsUrl } from './serviceUrls.js'
import {
  getCaseworkerCredentials,
  getGrantsCredentials
} from './credentialsHelper.js'

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

  await browser.url(url)
  browser.options.baseUrl = url

  await rememberCurrentUser({
    username,
    role: resolvedRole,
    loginType: role,
    service: 'caseworking'
  })

  console.log(`Logging into Caseworking as ${role}: ${username}`)
  await entraLogin(username, password)
}

export async function loginToGrants(role = 'applicant') {
  const url = getGrantsUrl()
  const { username, password } = getGrantsCredentials()

  await browser.url(url)
  browser.options.baseUrl = url

  await rememberCurrentUser({
    username,
    role: 'Grants user',
    loginType: role,
    service: 'grants'
  })

  console.log(`Logging into Grants as: ${username}`)
  await grantsLogin(username, password)
}
