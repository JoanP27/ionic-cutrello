import { Routes } from "@angular/router";
import { numericIdGuard } from "../shared/guards/numeric-id-guard";

export const routes: Routes = [
    {
        path: '', 
        loadComponent: () => import('./profile-page/profile-page').then((m) => m.ProfilePage),
        title: "Tareas | Cutrello"
    },
    {    
        path: ':id', 
        loadComponent: () => import('./profile-page/profile-page').then((m) => m.ProfilePage),
        canActivate: [numericIdGuard]
    }
]