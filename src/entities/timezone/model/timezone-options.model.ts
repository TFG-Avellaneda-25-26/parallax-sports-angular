import { getTimeZones } from "@vvo/tzdb";

export interface TimeZoneOption {
  value: string;
  label: string;
  offset: number;
  alternative: string;
}

export const TIMEZONE_OPTIONS: TimeZoneOption[] = getTimeZones({ includeUtc: true })
  .map(tz => ({
    value: tz.name,
    label: `(UTC${tz.currentTimeFormat}) ${tz.name}`,
    offset: tz.currentTimeOffsetInMinutes,
    alternative: tz.countryCode
  }));
