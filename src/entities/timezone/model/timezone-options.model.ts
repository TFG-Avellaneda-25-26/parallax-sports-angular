import { getTimeZones } from "@vvo/tzdb";

export interface TimeZoneOption {
  value: string;
  label: string;
}

export const TIMEZONE_OPTIONS: TimeZoneOption[] = getTimeZones({ includeUtc: true })
  .map(tz => ({
    value: tz.name,
    label: `(UTC${tz.currentTimeOffsetInMinutes >= 0 ? '+' : ''}${Math.floor(tz.currentTimeOffsetInMinutes / 60)}:${String(Math.abs(tz.currentTimeOffsetInMinutes % 60)).padStart(2, '0')}) ${tz.name}`,
    offset: tz.currentTimeOffsetInMinutes
  }))
  .sort((a, b) => a.offset - b.offset);
