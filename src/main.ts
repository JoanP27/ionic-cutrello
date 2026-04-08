import { provideZoneChangeDetection, provideZonelessChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { baseUrlInterceptor } from "./app/shared/interceptors/base-url-interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    //provideZoneChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([baseUrlInterceptor]))
  ],
});
