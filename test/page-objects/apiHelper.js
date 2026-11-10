import fs from 'fs/promises'
import Wreck from '@hapi/wreck'
import { config } from '../../wdio.conf.js'

export let generatedClientRef = ''
export let previousClientRef = ''

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.GAS_KEY}`
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
  world,
  options = {},
  headers = {}
) {
  const payloadData = await fs.readFile(payloadPath, 'utf-8')
  const originalPayload = JSON.parse(payloadData)

  // Preserve the original application reference for amendments
  console.log('Response body:', options.isAmend)
  console.log('AMENDED TRU??')
  if (options.isAmend) {
    setPreviousClientRef(world.originalClientRef)
  }

  const { payload, clientRef } = requestPayload(originalPayload, world, options)

  const url = buildUrl(endpoint)

  const response = await apiRequest('POST', url, {
    jsonBody: payload,
    headers
  })

  return {
    ...response,
    clientRef
  }
}

export async function getRequest(endpoint, queryParams = {}, headers = {}) {
  const url = buildUrl(endpoint, queryParams)
  return apiRequest('GET', url, { headers })
}

export function generateRandomClientRef() {
  const generatedClientRef =
    'client' + Math.random().toString(36).substring(2, 10)

  console.log('Generated CLIENT REF:', generatedClientRef)

  return generatedClientRef
}

export function setPreviousClientRef(clientRef) {
  if (!clientRef) {
    throw new Error('Original client reference is not set')
  }

  previousClientRef = clientRef

  console.log('Previous Client Ref:', previousClientRef)

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

function requestPayload(payload, world, { isAmend = false } = {}) {
  if (isAmend) {
    setPreviousClientRef(world.originalClientRef)
  }

  const stringifies = JSON.stringify(payload)

  const clientRef = generateRandomClientRef()

  console.log('API CLIENT REF:', clientRef)

  if (!isAmend) {
    world.sbi = generateSBI()
  }

  const replaced = stringifies
    .replace(/{{random_client_ref}}/g, clientRef)
    .replace(/{{previous_client_ref}}/g, isAmend ? getPreviousClientRef() : '')
    .replace(/{{current_datetime}}/g, getCurrentDatetimeISO())
    .replace(/{{random_frn}}/g, generateFRN())
    .replace(/{{random_sbi}}/g, world.sbi)

  return {
    payload: JSON.parse(replaced),
    clientRef
  }
}

function getCurrentDatetimeISO() {
  return new Date().toISOString()
}

function generateSBI() {
  return Math.floor(100_000_000 + Math.random() * 900_000_000).toString()
}

function generateFRN() {
  return Math.floor(1_000_000_000 + Math.random() * 9_000_000_000).toString()
}
