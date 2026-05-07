import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { TIMEZONE_OPTIONS } from '@entities/timezone';
import { UserStore } from '@entities/user';

@Component({
  selector: 'app-settings-preferences',
  imports: [],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {
  readonly timezonesOptions = TIMEZONE_OPTIONS;
  readonly userStore = inject(UserStore);

  readonly timeZoneForm = form(
    signal({ timeZone: this.userStore.timeZone()})
  );
}
