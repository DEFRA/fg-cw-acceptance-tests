export function resolveUrl(tags) {
  const environment = process.env.ENVIRONMENT || 'dev'
  if (environment === 'localhost') {
    return `http://localhost:3000/cases`
  } else if (tags.includes('@cw'))
    return `https://fg-cw-frontend.${environment}.cdp-int.defra.cloud/cases`
  else if (tags.includes('@grantsui'))
    return `https://grants-ui.${environment}.cdp-int.defra.cloud/flying-pigs/start`
  return 'https://default.example.com' // fallback
}
