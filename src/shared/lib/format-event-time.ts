export function formatEventTime(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const tz = timeZone || 'UTC';
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'UTC',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}
