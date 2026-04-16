import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemDetails } from '@entities/error';
import { ErrorStateStore } from '@shared/model';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const errorStateStore = inject(ErrorStateStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let problem: ProblemDetails;

      if (error.error && typeof error.error == 'object' && 'type' in error.error) {
        console.log("error.error: ", error.error);
        problem = error.error as ProblemDetails;
      } else {
        problem = {
          type: 'about:blank',
          title: getTitleByStatus(error.status) || 'Unknown Error',
          status: error.status,
          detail: error.message,
          instance: req.url
        };
      }

      const isRefreshFailure = req.url.includes('/api/auth/refresh') && error.status === 401;

      if (problem.status == 0 || problem.status == 404 || problem.status >= 500) {
        console.log("Error interceptor: ", problem);

        errorStateStore.set(problem);

        if (router.url !== '/error') {
          void router.navigate(['error']);
        }
      } else if (isRefreshFailure) {
        errorStateStore.set(problem)
      }

      return throwError(() => problem);
    })
  );
};

function getTitleByStatus(status: number): string {
  const statusTitles: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  };
  return statusTitles[status] || 'An error occurred';
}
