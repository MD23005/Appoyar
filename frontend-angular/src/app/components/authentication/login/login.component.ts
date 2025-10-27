import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth0IntegrationService } from '../../../services/auth0.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Bienvenido a Appoyar</h2>
          <p>Realiza donaciones a organizaciones de manera fácil y rápida</p>
        </div>

        <div class="login-options">
          <button class="btn-primary login-btn" (click)="login()">
            <span class="material-icons">login</span>
            Iniciar Sesión
          </button>

          <button class="btn-secondary login-btn" (click)="signup()">
            <span class="material-icons">person_add</span>
            Crear Cuenta
          </button>
        </div>

        <div class="auth0-info">
          <p><strong>¿Primera vez?</strong> Al crear una cuenta, tu información se guardará automáticamente en nuestra base de datos.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #e6f2ff 0%, #cce5ff 100%);
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(74, 144, 226, 0.15);
      max-width: 450px;
      width: 100%;
      text-align: center;
    }

    .login-header {
      margin-bottom: 2rem;
    }

    .login-header h2 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }

    .login-header p {
      color: #666;
      font-size: 1rem;
    }

    .login-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 12px 24px;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }

    .btn-primary {
      background-color: var(--primary-dark);
      color: white;
    }

    .btn-primary:hover {
      background-color: #2c6aa3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
    }

    .btn-secondary {
      background-color: #f8f9fa;
      color: var(--text-dark);
      border: 2px solid #e9ecef;
    }

    .btn-secondary:hover {
      background-color: #e9ecef;
      transform: translateY(-2px);
    }

    .login-features {
      text-align: left;
      border-top: 1px solid #e9ecef;
      padding-top: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .login-features h3 {
      color: var(--text-dark);
      margin-bottom: 1rem;
      font-size: 1.1rem;
      text-align: center;
    }

    .login-features ul {
      list-style: none;
      padding: 0;
    }

    .login-features li {
      padding: 0.5rem 0;
      color: #666;
      position: relative;
      padding-left: 1.5rem;
    }

    .login-features li:before {
      content: "✓";
      color: #27ae60;
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    .auth0-info {
      background-color: #f0f8ff;
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid var(--primary-blue);
    }

    .auth0-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  private auth0Service = inject(Auth0IntegrationService);

  login(): void {
    this.auth0Service.login();
  }

  signup(): void {
    this.auth0Service.signup();
  }
}