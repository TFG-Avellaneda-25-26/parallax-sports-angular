import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsNavStore } from '@shared/stores';
import { SettingsNavComponent } from "@widgets/settings-nav";
import { RouterOutlet } from '@angular/router';
import { AutocompleteComponent } from '@features/settings';

@Component({
  imports: [SettingsNavComponent, RouterOutlet, AutocompleteComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsNavStore],
})
export class SettingsPage { }
