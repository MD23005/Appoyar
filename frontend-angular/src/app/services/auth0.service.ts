import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class Auth0IntegrationService {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  user$ = this.auth.user$.pipe(
    filter(user => !!user),
    tap(user => {
      console.log('Usuario de Auth0:', user);
      this.syncUserWithBackend(user);
    })
  );

  isAuthenticated$ = this.auth.isAuthenticated$;

  private generateUsername(auth0User: any): string {
  
    if (auth0User.name && auth0User.name !== auth0User.email) {
      return auth0User.name;
    }

    if (auth0User.nickname && auth0User.nickname !== auth0User.email) {
      return auth0User.nickname;
    }

    const email = auth0User.email;
    if (email) {
      const usernamePart = email.split('@')[0];
      
      const cleanName = usernamePart.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      
      if (cleanName && cleanName.length > 1) {
    
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      }
      
      return 'Usuario_' + auth0User.sub.substring(0, 5);
    }

    return 'Usuario_' + auth0User.sub.substring(0, 8);
  }

  private syncUserWithBackend(auth0User: any) {
    const generatedName = this.generateUsername(auth0User);
    
    const userData = {
      nombre: generatedName,
      correo: auth0User.email,
      passwordHash: 'auth0_' + auth0User.sub
    };

    console.log('Generando nombre de usuario:', {
      email: auth0User.email,
      nameFromAuth0: auth0User.name,
      nickname: auth0User.nickname,
      generatedName: generatedName
    });

    this.userService.createUser(userData).subscribe({
      next: (user) => {
        console.log('Usuario sincronizado con backend:', user);
      },
      error: (error) => {
        if (error.status === 400 || error.status === 409) {
          console.log('Usuario ya existe en la base de datos');
        } else {
          console.error('Error sincronizando usuario:', error);
        }
      }
    });
  }

  isAuthenticated() {
    return this.auth.isAuthenticated$;
  }

  getUser() {
    return this.auth.user$;
  }

  login() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login'
      },
      appState: { target: '/panel' }
    });
  }

  signup() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      },
      appState: { target: '/panel' }
    });
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}