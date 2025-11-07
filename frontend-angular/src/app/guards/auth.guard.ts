import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth0IntegrationService } from '../services/auth0.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth0IntegrationService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    map(isAuth => {
      if (isAuth) {
        return true;
      }
      return router.createUrlTree(
        ['/auth/acceso'],
        { queryParams: { returnUrl: state.url } }
      );
    })
  );
};
