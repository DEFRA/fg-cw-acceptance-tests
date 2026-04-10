function getEnvironment() {
  return process.env.ENVIRONMENT || 'dev'
}

export function getCaseworkingUrl() {
  const environment = getEnvironment()

  if (environment === 'localhost') {
    return 'http://localhost:3000/cases'
  }

  return `https://fg-cw-frontend.${environment}.cdp-int.defra.cloud/cases`
}

export function getGrantsUrl() {
  const environment = getEnvironment()

  if (environment === 'localhost') {
    return 'http://localhost:3000/start'
  }

  return `https://grants-ui.${environment}.cdp-int.defra.cloud/pigs-might-fly/start`
}
