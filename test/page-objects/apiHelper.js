import fs from 'fs/promises'
import Wreck from '@hapi/wreck'
import { config } from '../../wdio.conf.js'

export let generatedClientRef = ''
export let previousClientRef = ''

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.GAS_KEY}`,
  'x-api-key': 'Pe5oGoD3rUEO6FV1HBIXNs0TuZesOnMB'
}

function buildUrl(endpoint, queryParams) {
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : ''
  return `${config.gasUrl}${endpoint}${queryString ? `?${queryString}` : ''}`
}

function parseJsonSafe(payloadBuffer) {
  const text = payloadBuffer?.toString?.().trim()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch (err) {
    console.warn('Response body is not valid JSON:', err)
    return null
  }
}

async function apiRequest(method, url, { jsonBody, headers = {} } = {}) {
  const wreck = Wreck.defaults({
    headers: { ...DEFAULT_HEADERS, ...headers }
  })

  console.log('Request headers:', headers)
  console.log('Request url:', url)

  try {
    const options = {}

    if (jsonBody !== undefined) {
      options.payload = JSON.stringify(jsonBody)
    }

    const { res, payload } =
      method === 'GET'
        ? await wreck.get(url, options)
        : await wreck.post(url, options)

    return {
      statusCode: res.statusCode,
      body: parseJsonSafe(payload)
    }
  } catch (error) {
    console.error(`API failed: ${error.message}`)
    throw error
  }
}

export async function postRequest(
  endpoint,
  payloadPath,
  options = {},
  headers = {}
) {
  const payloadData = await fs.readFile(payloadPath, 'utf-8')
  let payload = JSON.parse(payloadData)
  payload = requestPayload(payload, options)

  const url = buildUrl(endpoint)
  return apiRequest('POST', url, { jsonBody: payload, headers })
}

export async function getRequest(endpoint, queryParams = {}, headers = {}) {
  const url = buildUrl(endpoint, queryParams)
  return apiRequest('GET', url, { headers })
}

export function generateRandomClientRef() {
  generatedClientRef = 'client' + Math.random().toString(36).substring(2, 10)
  return generatedClientRef
}

export function setPreviousClientRef() {
  if (!generatedClientRef) {
    throw new Error('generatedClientRef is not set')
  }

  previousClientRef = generatedClientRef
  return previousClientRef
}

export function getPreviousClientRef() {
  if (!previousClientRef) {
    throw new Error('previousClientRef is not set')
  }

  return previousClientRef
}

export function resetClientRefs() {
  generatedClientRef = ''
  previousClientRef = ''
}

function requestPayload(payload, { isAmend = false } = {}) {
  if (isAmend) {
    setPreviousClientRef()
  }

  const stringifies = JSON.stringify(payload)

  const replaced = stringifies
    .replace(/{{random_client_ref}}/g, generateRandomClientRef())
    .replace(/{{previous_client_ref}}/g, isAmend ? getPreviousClientRef() : '')
    .replace(/{{current_datetime}}/g, getCurrentDatetimeISO())
    .replace(/{{random_frn}}/g, generateFRN())

  return JSON.parse(replaced)
}

function getCurrentDatetimeISO() {
  return new Date().toISOString()
}

function generateFRN() {
  return Math.floor(1_000_000_000 + Math.random() * 9_000_000_000).toString()
}
