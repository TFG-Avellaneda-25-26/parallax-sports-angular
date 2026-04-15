import { Component, inject } from '@angular/core';
import { UserStore } from '@features/user/store/user.store';

@Component({
  imports: [],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  protected readonly store = inject(UserStore);

  readonly user = this.store.user;
}
