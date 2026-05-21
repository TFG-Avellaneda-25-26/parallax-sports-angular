export function formatEventTime(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(navigator.language, {
    timeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
