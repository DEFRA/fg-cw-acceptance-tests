import fs from 'fs/promises'
import Wreck from '@hapi/wreck'
import { config } from '../../wdio.conf.js'

export let generatedClientRef = ''

export async function postRequest(endpoint, payloadPath, headers = {}) {
  const payloadData = await fs.readFile(payloadPath, 'utf-8')
  let payload = JSON.parse(payloadData)

  payload = requestPayload(payload)
  const url = `${config.gasUrl}${endpoint}`

  const wreck = Wreck.defaults({
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })

  try {
    const { res, payload: responsePayload } = await wreck.post(url, {
      payload: JSON.stringify(payload)
    })

    let responseBody = null

    const responseText = responsePayload?.toString?.().trim()
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText)
      } catch (err) {
        console.warn('Response body is not valid JSON:', err)
      }
    }

    return {
      statusCode: res.statusCode,
      body: responseBody
    }
  } catch (error) {
    console.error('API Request Failed:', error)
    throw error
  }
}

export function generateRandomClientRef() {
  generatedClientRef = 'client' + Math.random().toString(36).substring(2, 10)
  return generatedClientRef
}

function getCurrentDatetimeISO() {
  return new Date().toISOString() // "2025-04-14T13:43:38.341Z" format
}

function requestPayload(payload) {
  const stringifies = JSON.stringify(payload)

  const replaced = stringifies
    .replace(/{{random_client_ref}}/g, generateRandomClientRef())
    .replace(/{{current_datetime}}/g, getCurrentDatetimeISO())

  return JSON.parse(replaced)
}
