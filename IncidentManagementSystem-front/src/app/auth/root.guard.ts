import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, catchError, of } from 'rxjs';

export const rootGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.fetchCurrentUser().pipe(
    map(user => {
      if (!user) return router.createUrlTree(['/dashboard']);

      if (user.role === 'MODERATOR') {
        return router.createUrlTree(['/moderation-dashboard']);
      }

      if (user.role === 'USER') {
        return router.createUrlTree(['/incidents']);
      }

      return router.createUrlTree(['/dashboard']); // fallback
    }),
    catchError(() => of(router.createUrlTree(['/dashboard'])))
  );
};

