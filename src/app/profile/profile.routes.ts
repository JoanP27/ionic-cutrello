import { Routes } from "@angular/router";
import { numericIdGuard } from "../shared/guards/numeric-id-guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'me',
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadComponent: () => import('./profile-page/profile-page.page').then( m => m.ProfilePagePage),
    canActivate: [numericIdGuard]
  }
]