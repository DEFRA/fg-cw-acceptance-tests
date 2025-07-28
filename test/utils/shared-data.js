// Shared data store for cross-step communication
let currentReferenceNumber = null
let currentApplicationType = null

export const setReferenceNumber = (referenceNumber) => {
  currentReferenceNumber = referenceNumber
}

export const getReferenceNumber = () => {
  return currentReferenceNumber
}

export const setApplicationType = (applicationType) => {
  currentApplicationType = applicationType
}

export const getApplicationType = () => {
  return currentApplicationType
}
