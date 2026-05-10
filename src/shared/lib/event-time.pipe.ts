import { Pipe, PipeTransform } from '@angular/core';
import { formatEventTime } from './format-event-time';

@Pipe({ name: 'eventTime' })
export class EventTimePipe implements PipeTransform {
  transform(iso: string | null | undefined, locale: string, timeZone: string): string {
    return formatEventTime(iso, locale, timeZone);
  }
}
