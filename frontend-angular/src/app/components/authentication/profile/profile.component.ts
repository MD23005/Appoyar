import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../../services/auth0.service';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  // Servicio de autenticación (usuario Auth0)
  auth0Service = inject(Auth0IntegrationService);

  // Servicio de usuarios de backend (con puntos)
  private userService = inject(UserService);
  currentUser$: Observable<User | null> = this.userService.currentUser$;

  // Obtiene el nombre de display más amigable para el usuario
  getUserDisplayName(user: any): string {
    // Si viniera desde backend y tiene "nombre", usarlo
    if (user.nombre) {
      return user.nombre;
    }

    const email = user.email || user.correo;

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

  // Cierra la sesión del usuario actual y redirige a la página principal
  logout(): void {
    this.auth0Service.logout();
  }
}
