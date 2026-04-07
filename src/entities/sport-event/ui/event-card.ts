import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import type { SportEvent } from '../model/sport-event.types';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article class="event-card">
      <header>
        <span class="sport-badge">{{ event().sport }}</span>
        <h3>{{ event().title }}</h3>
      </header>
      <p class="date">{{ event().date | date: 'mediumDate' }}</p>
      <p class="location">{{ event().location }}</p>
      @if (event().description) {
        <p class="description">{{ event().description }}</p>
      }
    </article>
  `,
  styleUrl: './event-card.css',
})
export class EventCardComponent {
  event = input.required<SportEvent>();
}
