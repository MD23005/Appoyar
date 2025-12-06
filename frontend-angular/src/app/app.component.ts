import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Auth0IntegrationService } from './services/auth0.service';
import { UserService } from './services/user.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Servicios disponibles en la plantilla
  auth0Service = inject(Auth0IntegrationService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Usuario de backend (con puntos)
  currentUser$: Observable<User | null> = this.userService.currentUser$;

  // Controla si se muestra o no el badge flotante
  showGlobalPoints = false;

  ngOnInit(): void {
    // Mantiene viva la sincronización Auth0 -> backend
    this.auth0Service.user$.subscribe();

    // Estado inicial según la URL actual
    this.showGlobalPoints = this.router.url.startsWith('/panel');

    // Actualiza el flag cada vez que cambia la ruta
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.showGlobalPoints = event.urlAfterRedirects.startsWith('/panel');
      });
  }
}
