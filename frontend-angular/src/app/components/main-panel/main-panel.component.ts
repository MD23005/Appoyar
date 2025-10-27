import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-panel',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="main-container">
      <app-sidebar [isCollapsed]="sidebarCollapsed()" 
                  (toggleSidebar)="toggleSidebar()"></app-sidebar>
      
      <div class="main-content" [class.collapsed]="sidebarCollapsed()">
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--primary-light);
    }

    .main-content {
      flex: 1;
      margin-left: 250px;
      transition: margin-left 0.3s ease;
    }

    .main-content.collapsed {
      margin-left: 64px;
    }

    .content-area {
      padding: 2rem;
      min-height: 100vh;
    }
  `]
})
export class MainPanelComponent {
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }
}