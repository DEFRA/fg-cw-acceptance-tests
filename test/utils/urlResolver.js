export default function resolveUrl(tags) {
  const environment = process.env.ENVIRONMENT || 'dev'
  if (tags.includes('@cw'))
    return `https://fg-cw-frontend.${environment}.cdp-int.defra.cloud/cases`
  if (tags.includes('@grantsui'))
    return `https://grants-ui.${environment}.cdp-int.defra.cloud/flying-pigs/start`
  return 'https://default.example.com' // fallback
}
