import { CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentActivate {
  canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const logoutActivateGuard: CanActivateFn = (route, state) => {
  //TODO Aplicar AuthService.isLogged()
  return true;
};
