import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS, withXsrfConfiguration, withJsonpSupport } from '@angular/common/http';
import { API_BASE_URL } from '@shared/config';

import { routes } from './app.routes';
import { AuthInterceptor } from '@features/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withJsonpSupport(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: API_BASE_URL,
      useValue: 'http://localhost:8080/api',
    },
  ],
};

