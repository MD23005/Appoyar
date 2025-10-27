import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    
    AuthModule.forRoot({
      domain: 'dev-hsanq3qm5ekjk2si.us.auth0.com', //Dominio Auth0
      clientId: 'PqtL40rWTeJchs0lkpz4i3zdUf5stxkE', //Client Auth0
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }).providers!
  ]
};