import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.fetchCurrentUser().pipe(
    map(user => user ? true : router.createUrlTree(['/dashboard'])),
    catchError(() => of(router.createUrlTree(['/dashboard'])))
  );
};
