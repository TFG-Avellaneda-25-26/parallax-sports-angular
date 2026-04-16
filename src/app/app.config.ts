import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthInterceptor } from '@features/auth';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from '@shared/config';
import { errorInterceptor } from '@shared/api/error-interceptor';
import { authInterceptor } from '@shared/api/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor, authInterceptor])
    ),
    {
      provide: API_BASE_URL,
      useValue: 'http://localhost:8080'
    }
  ]
};
