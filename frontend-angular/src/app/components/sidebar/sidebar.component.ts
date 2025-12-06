import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../services/auth0.service';
import { UserRolesService } from '../../services/user-roles.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = input.required<boolean>();
  toggleSidebar = output<void>();

  auth0Service = inject(Auth0IntegrationService);
  userRolesService = inject(UserRolesService);
  userService = inject(UserService);

  // Variables para control de roles
  isAdmin$: Observable<boolean>;

  // Usuario de backend (incluye puntos)
  currentUser$: Observable<User | null>;

  constructor() {
    // Inicializar observable de permisos
    this.isAdmin$ = this.userRolesService.isAdmin();

    // Observable global del usuario de backend (con puntos)
    this.currentUser$ = this.userService.currentUser$;
  }

  // Obtiene el nombre de display del usuario para mostrar en la interfaz
  // Soporta tanto objeto de Auth0 (name, nickname, email) como del backend (nombre, correo)
  getUserDisplayName(user: any): string {
    // Si viene desde backend y tiene "nombre", usarlo
    if (user.nombre) {
      return user.nombre;
    }

    const email = user.email || user.correo;

    // Datos típicos de Auth0
    if (user.name && user.name !== email) {
      return user.name;
    }
    if (user.nickname && user.nickname !== email) {
      return user.nickname;
    }

    if (email) {
      const emailPart = email.split('@')[0];
      const cleanName = emailPart.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');

      if (cleanName && cleanName.length > 1) {
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      }
    }

    return 'Usuario';
  }

  // Cierra la sesion del usuario actual
  logout(): void {
    this.auth0Service.logout();
  }
}
