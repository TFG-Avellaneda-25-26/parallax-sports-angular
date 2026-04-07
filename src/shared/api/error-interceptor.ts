import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemDetails } from '@entities/error';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router)

  // TESTING PURPOSES: Simulate an error response for a specific endpoint
  // if (req.url.endsWith('/test')) {
  //   const customProblem: ProblemDetails = {
  //     type: '/problems/testing-error',
  //     title: 'Testing Error',
  //     status: 503,
  //     detail: 'This is a simulated error for testing purposes.',
  //     instance: req.url
  //   };

  //   // Navegamos con los datos personalizados
  //   router.navigate(['error'], { state: { data: customProblem } });

  //   // Cortamos la petición real y lanzamos el error
  //   return throwError(() => new HttpErrorResponse({
  //     error: customProblem,
  //     status: 503,
  //     url: req.url
  //   }));
  // }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let problem: ProblemDetails;

      if (error.error && typeof error.error == 'object' && 'type' in error.error) {
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

        router.navigate(['error'], { state: { data: problem}});
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
