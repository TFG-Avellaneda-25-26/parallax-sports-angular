import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserStore } from '@entities/user';
import { API_BASE_URL } from '@shared/config';
import { StatefulInput } from "@shared/ui";
import { createEmailForm } from './forms/email-form';
import { createPasswordForm } from './forms/password-form';
import { TIMEZONE_OPTIONS } from '@entities/timezone';
import { createdisplayNameForm } from './forms/display-name-form';

@Component({
  selector: 'app-settings-account',
  imports: [FormRoot, StatefulInput, FormField],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  readonly apiBaseUrl = inject(API_BASE_URL);
  readonly userStore = inject(UserStore);
  readonly router = inject(Router);
  readonly timeZoneOptions = TIMEZONE_OPTIONS;

  readonly timeZoneForm = form(
    signal({ timeZone: this.userStore.timeZone()})
  );

  readonly displayNameForm = createdisplayNameForm();
  readonly emailForm = createEmailForm();
  readonly passwordForm = createPasswordForm();
}
