import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SportEvent } from '@entities/event';
import { EventCardComponent } from '../event-card/event-card';

@Component({
  selector: 'app-event-card-grid',
  imports: [EventCardComponent],
  templateUrl: './event-card-grid.html',
  styleUrl: './event-card-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardGridComponent {
  readonly events = input.required<SportEvent[]>();
}
