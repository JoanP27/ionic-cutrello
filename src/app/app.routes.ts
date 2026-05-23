import { Routes } from '@angular/router';
import { loginActivateGuard } from './shared/guards/login-activate-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.routes').then((m) => m.taskRoutes),
    canActivate: [loginActivateGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.routes').then((p) => p.routes),
    canActivate: [loginActivateGuard]
  }
];
