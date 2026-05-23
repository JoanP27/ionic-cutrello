import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const numericIdGuard: CanActivateFn = (route, state) => {
   const id = +(route.paramMap.get('id') ?? 0);
  const router = inject(Router);


  // Si el id de la ruta no es valido entonces redirigira a la pagina de tareas
  if(isNaN(id) || !Number.isInteger(id) || id < 1) {
    return router.createUrlTree(['/tasks']);
  }
  return true;
};
