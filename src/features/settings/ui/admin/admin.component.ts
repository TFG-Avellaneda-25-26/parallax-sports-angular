import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SettingsNavStore } from '@shared/stores';
import { scrollToSection } from '@shared/lib';
import { LogsComponent } from './sections/logs/logs.component';
import { UsersComponent } from './sections/users/users.component';
import { EventsComponent } from './sections/events/events.component';
import { StressTestingComponent } from './sections/stress-testing/stress-testing.component';

@Component({
  selector: 'app-settings-admin',
  imports: [LogsComponent, UsersComponent, EventsComponent, StressTestingComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly navStore = inject(SettingsNavStore);

  constructor() {
    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;
      const el = document.getElementById(section);
      if (!el) return;
      scrollToSection(el);
      el.classList.add('section--active');
      setTimeout(() => el.classList.remove('section--active'), 1500);
    });
  }
}
