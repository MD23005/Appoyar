import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-wrapper">
      <h1>Ocurrió un error</h1>
      <p>No se pudo completar la operación.</p>
      <button (click)="goDashboard()">Regresar al Dashboard</button>
    </div>
  `,
  styles: [`
    .error-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      background: #e8f2ff;
    }
    button {
      background: #2374c6;
      border: none;
      color: #fff;
      padding: .6rem 1.3rem;
      border-radius: .4rem;
      cursor: pointer;
    }
  `]
})
export class ErrorPageComponent {
  constructor(private router: Router) {}
  goDashboard() {
    this.router.navigate(['/panel/dashboard']);
  }
}
