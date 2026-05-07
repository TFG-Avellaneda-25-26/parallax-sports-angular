import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormRoot, FormField } from '@angular/forms/signals';
import { TIMEZONE_OPTIONS } from '@entities/timezone';
import { UserStore } from '@entities/user';
import { createTimeZoneForm } from './forms/timezone-form';

@Component({
  selector: 'app-settings-preferences',
  imports: [FormRoot, FormField],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {
  readonly timezonesOptions = TIMEZONE_OPTIONS;
  readonly userStore = inject(UserStore);

  readonly timeZoneForm = createTimeZoneForm();
}
