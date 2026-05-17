import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from '@shared/config';
import { errorInterceptor, authInterceptor } from '@shared/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor, authInterceptor])
    ),
    {
      provide: API_BASE_URL,
      // Empty = same-origin: nginx proxies /api/* to spring-boot, browser hits
      // whatever host serves the SPA (localhost in dev, the LXC IP / cloudflared
      // hostname in prod). No CORS headaches.
      useValue: ''
    }
  ]
};
