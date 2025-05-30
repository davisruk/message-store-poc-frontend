import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { messageReducer } from './state/message.reducer';
import { MessageEffects } from './state/message.effects';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ messageState: messageReducer }),
    provideEffects([MessageEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]  
};
