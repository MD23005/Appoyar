import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../../services/auth0.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <h2>Mi Perfil</h2>
          <p>Información de tu cuenta</p>
        </div>

        <div class="profile-info" *ngIf="auth0Service.getUser() | async as user">
          <div class="info-item">
            <label>Nombre:</label>
            <span class="username">{{ getUserDisplayName(user) }}</span>
          </div>
          
          <div class="info-item">
            <label>Correo Electrónico:</label>
            <span>{{ user.email }}</span>
          </div>

          <div class="info-item">
            <label>Email Verificado:</label>
            <span [class.verified]="user.email_verified" [class.not-verified]="!user.email_verified">
              {{ user.email_verified ? 'Sí' : 'No' }}
            </span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn-primary logout-btn" (click)="logout()">
            <span class="material-icons">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      margin: 0 auto;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-header h2 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .profile-header p {
      color: #666;
    }

    .profile-info {
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #e9ecef;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item label {
      font-weight: 600;
      color: var(--text-dark);
      min-width: 150px;
    }

    .info-item span {
      color: #666;
      text-align: right;
    }

    .username {
      font-weight: 600;
      color: var(--primary-dark) !important;
    }

    .verified {
      color: #27ae60;
      font-weight: 600;
    }

    .not-verified {
      color: #e74c3c;
      font-weight: 600;
    }

    .profile-actions {
      text-align: center;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 12px 24px;
      margin: 0 auto;
    }
  `]
})
export class ProfileComponent {
  auth0Service = inject(Auth0IntegrationService);

  getUserDisplayName(user: any): string {
    if (user.name && user.name !== user.email) {
      return user.name;
    }
    if (user.nickname && user.nickname !== user.email) {
      return user.nickname;
    }
    
    const emailPart = user.email.split('@')[0];
    const cleanName = emailPart.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    
    if (cleanName && cleanName.length > 1) {
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
    }
    
    return 'Usuario';
  }

  logout(): void {
    this.auth0Service.logout();
  }
}