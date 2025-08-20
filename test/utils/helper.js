export function getTodayFormatted() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = today.toLocaleString('en-GB', { month: 'short' })
  const year = today.getFullYear()
  return `${day} ${month} ${year}`
}
