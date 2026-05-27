export function formatEventTime(iso: string | null | undefined, timeZone: string, dateFormat?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const tz = timeZone || 'UTC';
  try {
    const dateStr = buildDateStr(date, tz, locale, dateFormat);
    const timeStr = new Intl.DateTimeFormat(locale, { timeZone: tz, timeStyle: 'short' }).format(date);
    return `${dateStr}, ${timeStr}`;
  } catch {
    const dateStr = buildDateStr(date, 'UTC', locale, dateFormat);
    const timeStr = new Intl.DateTimeFormat(locale, { timeZone: 'UTC', timeStyle: 'short' }).format(date);
    return `${dateStr}, ${timeStr}`;
  }
}

function buildDateStr(date: Date, tz: string, locale: string, dateFormat?: string): string {
  if (!dateFormat) {
    return new Intl.DateTimeFormat(locale, { timeZone: tz, dateStyle: 'medium' }).format(date);
  }

  const parts = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const p: Record<string, string> = {};
  for (const part of parts) p[part.type] = part.value;

  switch (dateFormat) {
    case 'MM/DD/YYYY': return `${p['month']}/${p['day']}/${p['year']}`;
    case 'DD/MM/YYYY': return `${p['day']}/${p['month']}/${p['year']}`;
    case 'YYYY/MM/DD': return `${p['year']}/${p['month']}/${p['day']}`;
    case 'MMM D, YYYY': {
      const mon = new Intl.DateTimeFormat(locale, { timeZone: tz, month: 'short' }).format(date);
      return `${mon} ${parseInt(p['day'], 10)}, ${p['year']}`;
    }
    case 'D MMM YYYY': {
      const mon = new Intl.DateTimeFormat(locale, { timeZone: tz, month: 'short' }).format(date);
      return `${parseInt(p['day'], 10)} ${mon} ${p['year']}`;
    }
    default:
      return new Intl.DateTimeFormat(locale, { timeZone: tz, dateStyle: 'medium' }).format(date);
  }
}
