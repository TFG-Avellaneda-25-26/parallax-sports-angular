import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SettingsNavIconName =
  | 'user-round-pen'
  | 'mails'
  | 'lock'
  | 'type-outline'
  | 'share-2'
  | 'trash-2'
  | 'bolt'
  | 'clock-10'
  | 'calendar-1'
  | 'chart-no-axes-gantt'
  | 'trophy'
  | 'bell-ring'
  | 'shield-ellipsis'
  | 'scroll-text'
  | 'users-round'
  | 'package-plus'
  | 'bug-play';

@Component({
  selector: 'app-settings-nav-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-nav-icon.component.html',
  styleUrl: './settings-nav-icon.component.css',
})
export class SettingsNavIconComponent {
  readonly name = input.required<SettingsNavIconName>();
}
