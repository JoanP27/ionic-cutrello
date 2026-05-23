import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { map } from 'rxjs';



export const loginActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const result = authService.isLogged().pipe(map((logged: boolean) => {

    if(!logged) { return router.createUrlTree(['/auth/login']); }
    return true
  }))

  return result
};
