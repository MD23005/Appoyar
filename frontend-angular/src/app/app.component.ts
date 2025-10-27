import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth0IntegrationService } from './services/auth0.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  private auth0Service = inject(Auth0IntegrationService);

  ngOnInit() {
    this.auth0Service.user$.subscribe();
  }
}