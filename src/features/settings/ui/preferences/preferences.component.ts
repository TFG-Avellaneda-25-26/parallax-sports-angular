import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormRoot, FormField } from '@angular/forms/signals';
import { TIMEZONE_OPTIONS } from '@entities/timezone';
import { createTimeZoneForm } from './forms/timezone-form';
import { StatefulComboxAutocompleteSelectComponent, StatefulComboboxSelectInputComponent, StatefulInput } from "@shared/ui";
import { createDefaultViewForm } from './forms/default-view-form';
import { createDateFormatForm } from './forms/date-format-form';
import { SettingsNavStore } from '@shared/stores';
import { scrollToSection } from '@shared/lib';
import { preferencesI18n } from '@features/settings';
import { Lang } from "./section/lang/lang";

@Component({
  selector: 'app-settings-preferences',
  imports: [FormRoot, FormField, StatefulComboxAutocompleteSelectComponent, StatefulComboboxSelectInputComponent, StatefulInput, Lang],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {

  readonly i18n = preferencesI18n;

  readonly navStore = inject(SettingsNavStore);
  readonly timezonesOptions = TIMEZONE_OPTIONS;

  readonly timeZoneForm = createTimeZoneForm();
  readonly defaultViewForm = createDefaultViewForm();
  readonly dateFormatForm = createDateFormatForm();

  readonly formats = [
    { value: 'MM/DD/YYYY', example: '05/19/2026' },
    { value: 'DD/MM/YYYY', example: '19/05/2026' },
    { value: 'YYYY/MM/DD', example: '2026/05/19' },
    { value: 'MMM D, YYYY', example: 'May 19, 2026'},
    { value: 'D MMM YYYY', example: '19 May 2026' },
  ];

  readonly defaultViewOptions = [
    { value: 'CARDS' },
    { value: 'TABLE' },
  ];

  constructor() {
    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;

      const el = document.getElementById(section);
      if (!el) return;

      setTimeout(() => scrollToSection(el), 0);
    })
  }
}
