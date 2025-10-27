import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container" *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button class="btn-primary" (click)="logout()">
        Cerrar Sesión
      </button>
    </div>
    
    <ng-template #loggedOut>
      <div class="auth-container">
        <button class="btn-primary" (click)="login()">
          Iniciar Sesión
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
    }
  `]
})
export class AuthButtonComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  login(): void {
    this.auth.loginWithRedirect({
      appState: { target: '/panel' }
    });
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}