import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './service/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), 
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      })
    ),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Register the interceptor
    )
  ]
};
