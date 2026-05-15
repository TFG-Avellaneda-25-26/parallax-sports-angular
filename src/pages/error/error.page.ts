import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorDisplay } from '@features/error';

@Component({
  imports: [ErrorDisplay],
  templateUrl: './error.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
}
