import fs from 'fs/promises'
import Wreck from '@hapi/wreck'

export let generatedClientRef = ''

export async function postRequest(endpoint, payloadPath, headers = {}) {
  const payloadData = await fs.readFile(payloadPath, 'utf-8')
  let payload = JSON.parse(payloadData)

  // 🔥 Replace placeholders
  payload = replacePlaceholders(payload)
  const url = `https://fg-gas-backend.dev.cdp-int.defra.cloud/grants/${endpoint}`

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

    const responseBody = JSON.parse(responsePayload.toString())

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

function replacePlaceholders(payload) {
  const stringified = JSON.stringify(payload)

  const replaced = stringified
    .replace(/{{random_client_ref}}/g, generateRandomClientRef())
    .replace(/{{current_datetime}}/g, getCurrentDatetimeISO())

  return JSON.parse(replaced)
}
