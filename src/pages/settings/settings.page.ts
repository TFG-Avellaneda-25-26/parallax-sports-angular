import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsNavStore } from '@shared/stores';
import { SettingsNavComponent } from "@widgets/settings-nav";

@Component({
  imports: [SettingsNavComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsNavStore],
})
export class SettingsPage { }
