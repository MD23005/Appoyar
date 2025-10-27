import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../services/auth0.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed()">
      <div class="sidebar-header">
        <button class="toggle-btn" (click)="toggleSidebar.emit()">
          <span class="material-icons">menu</span>
        </button>
        <h2 *ngIf="!isCollapsed()">Appoyar</h2>
      </div>

      <nav class="sidebar-nav">
        <div *ngIf="auth0Service.isAuthenticated() | async; else notAuthenticated">
          <a class="nav-item" 
             routerLink="/panel/dashboard" 
             routerLinkActive="active"
             [class.collapsed]="isCollapsed()">
            <span class="material-icons">dashboard</span>
            <span *ngIf="!isCollapsed()">Dashboard</span>
          </a>
          
          <a class="nav-item" 
             routerLink="/panel/perfil" 
             routerLinkActive="active"
             [class.collapsed]="isCollapsed()">
            <span class="material-icons">account_circle</span>
            <span *ngIf="!isCollapsed()">Mi Perfil</span>
          </a>

          <a class="nav-item" 
             (click)="logout()"
             [class.collapsed]="isCollapsed()">
            <span class="material-icons">logout</span>
            <span *ngIf="!isCollapsed()">Cerrar Sesión</span>
          </a>
        </div>

        <ng-template #notAuthenticated>
          <a class="nav-item" 
             routerLink="/auth/acceso" 
             routerLinkActive="active"
             [class.collapsed]="isCollapsed()">
            <span class="material-icons">login</span>
            <span *ngIf="!isCollapsed()">Iniciar Sesión</span>
          </a>
        </ng-template>
      </nav>

      <div class="user-info" *ngIf="(auth0Service.isAuthenticated() | async) && !isCollapsed() && (auth0Service.getUser() | async) as user">
        <div class="user-details">
          <span class="user-name">{{ getUserDisplayName(user) }}</span>
          <span class="user-email">{{ user.email }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: var(--primary-dark);
      color: white;
      position: fixed;
      height: 100vh;
      transition: width 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.2rem;
      white-space: nowrap;
      overflow: hidden;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .sidebar-nav {
      padding: 1rem 0;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      color: white;
      text-decoration: none;
      transition: background-color 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;
    }

    .nav-item.collapsed {
      justify-content: center;
      padding: 0.75rem;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-item.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-right: 3px solid white;
    }

    .nav-item .material-icons {
      flex-shrink: 0;
    }

    .user-info {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.05);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-email {
      font-size: 0.8rem;
      opacity: 0.8;
    }
  `]
})
export class SidebarComponent {
  isCollapsed = input.required<boolean>();
  toggleSidebar = output<void>();
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