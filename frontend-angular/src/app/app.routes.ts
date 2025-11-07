import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ProfileComponent } from './components/authentication/profile/profile.component';
import { AuthCallbackComponent } from './components/authentication/auth-callback/auth-callback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganizationListComponent } from './components/organizations/organization-list/organization-list.component';
import { OrganizationDetailComponent } from './components/organizations/organization-detail/organization-detail.component';
import { OrganizationFormComponent } from './components/organizations/organization-form/organization-form.component';
import { StoreListComponent } from './components/store/store-list.component';
import { ErrorPageComponent } from './components/error/error-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // pública
  { path: '', component: WelcomeComponent },

  // auth
  {
    path: 'auth',
    children: [
      { path: 'acceso', component: LoginComponent },
      { path: 'callback', component: AuthCallbackComponent },
      { path: '', redirectTo: 'acceso', pathMatch: 'full' }
    ]
  },

  // panel protegido
  {
    path: 'panel',
    component: MainPanelComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'organizations', component: OrganizationListComponent, canActivate: [authGuard] },
      { path: 'organizations/new', component: OrganizationFormComponent, canActivate: [authGuard] },
      { path: 'organizations/:nit', component: OrganizationDetailComponent, canActivate: [authGuard] },
      { path: 'organizations/edit/:nit', component: OrganizationFormComponent, canActivate: [authGuard] },
      { path: 'tienda', component: StoreListComponent, canActivate: [authGuard] },
      { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // error genérica
  { path: 'error', component: ErrorPageComponent },

  // cualquier otra
  { path: '**', redirectTo: 'error' }
];
