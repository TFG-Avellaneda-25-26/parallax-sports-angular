import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error-display',
  imports: [],
  templateUrl: './error-display.html',
  styleUrl: './error-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplay {
  title = input.required<string>();
  detail = input.required<string>()
  status = input.required<number>();
  instance = input<string | undefined>(undefined);
}
