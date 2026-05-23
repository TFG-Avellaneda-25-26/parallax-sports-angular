import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Stateless toggle rendered as one of two Lucide SVGs (square / square-check-big).
 * Acts as a checkbox replacement with `role="switch"` so screen readers
 * announce the on/off state without the visual native UI.
 */
@Component({
  selector: 'app-checkbox-icon',
  standalone: true,
  templateUrl: './checkbox-icon.component.html',
  styleUrl: './checkbox-icon.component.css',
  host: {
    role: 'switch',
    tabindex: '0',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '[class.disabled]': 'disabled()',
    '(click)': 'onActivate($event)',
    '(keydown.enter)': 'onActivate($event)',
    '(keydown.space)': 'onActivate($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxIconComponent {
  readonly checked = input.required<boolean>();
  readonly disabled = input(false, { transform: (v: boolean | string) => v === '' || v === true });
  readonly toggled = output<boolean>();

  protected onActivate(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.toggled.emit(!this.checked());
  }
}
