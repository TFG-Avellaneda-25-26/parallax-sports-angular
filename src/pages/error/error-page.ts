import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProblemDetails } from '@entities/error';
import { ErrorStateStore } from '@shared/model';
import { ErrorDisplay } from './ui/error-display/error-display';

@Component({
  selector: 'app-error-page',
  imports: [ErrorDisplay],
  templateUrl: './error-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {

  private readonly errorStateStore = inject(ErrorStateStore);

  public readonly errorData = computed<ProblemDetails | undefined>(() => {
    return this.errorStateStore.error() ?? (history.state?.data as ProblemDetails | undefined);
  });

  public readonly displayError = computed<ProblemDetails>(() => {
    const data = this.errorData();

    return {
      type: data?.type ?? 'about:blank',
      title: data?.title ?? 'Unexpected Error',
      status: data?.status ?? 500,
      detail: data?.detail ?? 'No additional information provided.',
      instance: data?.instance
    };
  });
}
