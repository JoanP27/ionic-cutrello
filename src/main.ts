import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
//import { authInterceptor } from './app/interceptors/auth-interceptor';
import { baseUrlInterceptor } from './app/shared/interceptors/base-url-interceptor';
import {
  provideSignalFormsConfig,
  SignalFormsConfig,
} from '@angular/forms/signals';
import { authInterceptor } from './app/shared/interceptors/auth-interceptor';
import { provideGoogleId } from './app/shared/google-login/google-login.config';

export const NG_STATUS_CLASSES: SignalFormsConfig['classes'] = {
  'ng-touched': ({ state }) => state().touched(),
  'ng-untouched': ({ state }) => !state().touched(),
  'ng-dirty': ({ state }) => state().dirty(),
  'ng-pristine': ({ state }) => !state().dirty(),
  'ng-valid': ({ state }) => state().valid(),
  'ng-invalid': ({ state }) => state().invalid(),
  'ng-pending': ({ state }) => state().pending(),
};

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    //provideZoneChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withRouterConfig({paramsInheritanceStrategy: 'always'}), withComponentInputBinding()),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideGoogleId('389388754773-5jflblnhhm4qfmk8mf0egdu5die7epda.apps.googleusercontent.com'),
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
});
