import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProblemDetails } from '@entities/error';
import { ErrorDisplay } from './ui/error-display/error-display';

@Component({
  selector: 'app-error-page',
  imports: [ErrorDisplay],
  templateUrl: './error-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
  public readonly errorData = signal<ProblemDetails | undefined>(history.state?.data);
}
