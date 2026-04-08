import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProblemDetails } from '@entities/error';

@Component({
  selector: 'app-error-display',
  imports: [],
  templateUrl: './error-display.html',
  styleUrl: './error-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplay {
  error = input.required<ProblemDetails>();
}
