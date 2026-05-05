import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemDetails } from '@shared/models';
import { ErrorStore } from '@shared/stores';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const errorStore = inject(ErrorStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let problem: ProblemDetails;

      if (error.error && typeof error.error == 'object' && 'type' in error.error) {
        console.log("error.error: ", error.error);
        problem = error.error as ProblemDetails;
      } else if (error.status === 0) {
        problem = {
          type: 'about:blank',
          title: 'Network Error',
          status: 0,
          detail: 'Unable to reach the server. Please check your connection and try again.',
          instance: req.url
        };
      } else {
        problem = {
          type: 'about:blank',
          title: getTitleByStatus(error.status),
          status: error.status,
          detail: 'An unexpected error occurred.',
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
  const statusTitles: Record<number, string> = {
    0: 'Network Error',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  };
  return statusTitles[status] || 'An error occurred';
}
