import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { errorI18n, errorStatusTitles } from '@shared/i18n';
import { ProblemDetails } from '@shared/models';
import { ErrorStore } from '@shared/stores';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const errorStore = inject(ErrorStore);
  const i18n = errorI18n;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let problem: ProblemDetails;

      if (error.error && typeof error.error == 'object' && 'type' in error.error) {
        console.log("error.error: ", error.error);
        problem = error.error as ProblemDetails;

        problem = {
          ...problem,
          title: errorStatusTitles[problem.status] ?? problem.title,
          detail: problem.status >= 500
            ? errorI18n.unexpectedDetail
            : problem.detail,
        }
      } else if (error.status === 0) {
        problem = {
          type: 'about:blank',
          title: errorStatusTitles[0],
          status: 0,
          detail: i18n.networkDetail,
          instance: req.url
        };
      } else {
        problem = {
          type: 'about:blank',
          title: getTitleByStatus(error.status),
          status: error.status,
          detail: i18n.unexpectedDetail,
          instance: req.url
        };
      }

      const isRefreshFailure = req.url.includes('/api/auth/refresh') && error.status === 401;

      if (problem.status == 0 || problem.status == 404 || problem.status >= 500) {
        console.log("Error interceptor: ", problem);

        errorStore.set(problem);

        if (router.url !== '/error') {
          void router.navigate(['error']);
        }
      } else if (isRefreshFailure) {
        errorStore.set(problem)
      }

      return throwError(() => problem);
    })
  );
};

function getTitleByStatus(status: number): string {
  return errorStatusTitles[status] ?? $localize`:@@error.status.unknown:Unknown Error`;
}
