import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemDetails } from '@entities/error';
import { ErrorStateStore } from '@shared/model';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const errorStateStore = inject(ErrorStateStore);

  // TESTING PURPOSES: Simulate an error response for a specific endpoint
  // if (req.url.endsWith('/test')) {
  //   const customProblem: ProblemDetails = {
  //     type: '/problems/testing-error',
  //     title: 'Testing Error',
  //     status: 503,
  //     detail: 'This is a simulated error for testing purposes.',
  //     instance: req.url
  //   };

  //   errorStateStore.set(customProblem);

  //   if (router.url !== '/error') {
  //     void router.navigate(['error'], { state: { data: customProblem } });
  //   }

  //   return throwError(() => customProblem);
  // }

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

      if (problem.status == 0 || problem.status == 404 || problem.status >= 500) {
        console.log("Error interceptor: ", problem);

        errorStateStore.set(problem);

        if (router.url !== '/error') {
          void router.navigate(['error'], { state: { data: problem } });
        }
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
