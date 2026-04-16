import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { UserStore } from '@features/user/store/user.store';
import { EventStore } from '@features/events/store/event.store';

@Component({
  imports: [JsonPipe],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  protected readonly userStore = inject(UserStore);
  protected readonly eventStore = inject(EventStore);

  readonly user = this.userStore.user;
  readonly events = this.eventStore.events;
}
