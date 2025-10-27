import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Panel de control</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">assessment</span>
          </div>
          <div class="stat-content">
            <h3>Proyectos Activos</h3>
            <p class="stat-number">1</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">task</span>
          </div>
          <div class="stat-content">
            <h3>Tareas Pendientes</h3>
            <p class="stat-number">3</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">group</span>
          </div>
          <div class="stat-content">
            <h3>Miembros del Equipo</h3>
            <p class="stat-number">6</p>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Actividad Pendientes</h2>
        <div class="activity-list">
          <div class="activity-item">
            <span class="material-icons">add_circle</span>
            <div class="activity-content">
              <p>Crear Modulo de Organizaciones</p>
            </div>
          </div>
          <div class="activity-item">
            <span class="material-icons">add_circle</span>
            <div class="activity-content">
              <p>Asignacion de Roles</p>
            </div>
          </div>
          <div class="activity-item">
            <span class="material-icons">add_circle</span>
            <div class="activity-content">
              <p>Crear modulo de Tienda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      background: var(--primary-light);
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon .material-icons {
      color: var(--primary-dark);
      font-size: 2rem;
    }

    .stat-content h3 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .stat-number {
      color: var(--primary-dark);
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
    }

    .recent-activity {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .recent-activity h2 {
      color: var(--text-dark);
      margin-bottom: 1.5rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .activity-item .material-icons {
      color: var(--primary-dark);
    }

    .activity-content p {
      margin: 0;
      color: var(--text-dark);
      font-weight: 500;
    }

    .activity-content small {
      color: #666;
    }
  `]
})
export class DashboardComponent {
}