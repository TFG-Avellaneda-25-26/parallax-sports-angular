import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SettingsNavStore } from '@shared/stores';
import { scrollToSection } from '@shared/lib';
import { preferencesI18n } from '@features/settings';
import { LangComponent } from "./section/lang/lang.component";
import { DefaultViewComponent } from "./section/default-view/default-view.component";
import { DateFormatComponent } from "./section/date-format/date-format.component";
import { TimezoneComponent } from "./section/timezone/timezone.component";

@Component({
  selector: 'app-settings-preferences',
  imports: [LangComponent, DefaultViewComponent, DateFormatComponent, TimezoneComponent],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {

  readonly i18n = preferencesI18n;
  readonly navStore = inject(SettingsNavStore);

  constructor() {
    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;
      const el = document.getElementById(section);
      if (!el) return;
      scrollToSection(el);
    })
  }
}
