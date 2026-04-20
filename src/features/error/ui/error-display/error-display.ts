import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorStore } from '@shared/stores';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.html',
  styleUrl: './error-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplay {
  readonly errorStore = inject(ErrorStore);
}
