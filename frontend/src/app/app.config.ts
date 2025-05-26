import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { APP_FEATURE_STATES } from './store/app.state';
import { authInterceptor } from './auth/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideEffects(),
    ...APP_FEATURE_STATES, // feature reducers + effects
    provideRouter(routes), 
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
