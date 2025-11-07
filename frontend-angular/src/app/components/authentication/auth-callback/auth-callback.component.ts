import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        // 1) si Auth0 envió un destino en appState
        const target = (result?.appState as any)?.target;

        // 2) si el guard te mandó con ?returnUrl=/panel/tienda
        const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'];

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (target) {
          this.router.navigateByUrl(target);
        } else {
          this.router.navigate(['/panel/dashboard']);
        }
      },
      error: () => {
        this.router.navigate(['/error']);
      }
    });
  }
}
