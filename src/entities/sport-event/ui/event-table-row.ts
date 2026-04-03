import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import type { SportEvent } from '../model/sport-event.types';

@Component({
  selector: '[appEventTableRow]',
  standalone: true,
  imports: [DatePipe],
  template: `
    <td>{{ event().sport }}</td>
    <td>{{ event().title }}</td>
    <td>{{ event().date | date: 'mediumDate' }}</td>
    <td>{{ event().location }}</td>
  `,
})
export class EventTableRowComponent {
  event = input.required<SportEvent>({ alias: 'appEventTableRow' });
}
