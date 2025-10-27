import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card">
        <div class="spinner"></div>
        <h3>Procesando autenticación...</h3>
        <p>Estamos redirigiendo a tu panel de control</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e6f2ff 0%, #cce5ff 100%);
      padding: 20px;
    }

    .callback-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(74, 144, 226, 0.15);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e6f2ff;
      border-top: 4px solid var(--primary-dark);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    h3 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/panel']);
    }, 2000);
  }
}