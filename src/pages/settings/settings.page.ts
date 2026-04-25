import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsNavComponent } from "@widgets/settings-nav";

@Component({
  imports: [SettingsNavComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage { }
