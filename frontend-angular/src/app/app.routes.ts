import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ProfileComponent } from './components/authentication/profile/profile.component';
import { AuthCallbackComponent } from './components/authentication/auth-callback/auth-callback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { 
    path: 'auth', 
    children: [
      { path: 'acceso', component: LoginComponent },
      { path: 'callback', component: AuthCallbackComponent },
      { path: '', redirectTo: 'acceso', pathMatch: 'full' }
    ]
  },
  { 
    path: 'panel', 
    component: MainPanelComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
    ]
  },
  { path: '**', redirectTo: '' }
];