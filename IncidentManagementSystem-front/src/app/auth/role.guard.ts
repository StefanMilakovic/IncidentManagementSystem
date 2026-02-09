import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {catchError, map, of} from 'rxjs';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[] | undefined;

  return auth.fetchCurrentUser().pipe(
    map(user => {
      if (!user) return router.createUrlTree(['/dashboard']);
      if (!allowedRoles || allowedRoles.length === 0) return true;
      return allowedRoles.some(role => auth.hasRole(role))
        ? true
        : router.createUrlTree(['/no-access']);
    }),
    catchError(() => of(router.createUrlTree(['/dashboard'])))
  );
};




