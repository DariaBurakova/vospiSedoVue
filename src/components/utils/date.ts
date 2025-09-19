export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(date)
}
