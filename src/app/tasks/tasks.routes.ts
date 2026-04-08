import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page-guard";
import { numericIdGuard } from "../shared/guards/numeric-id-guard";
import { loginActivateGuard } from "../shared/guards/login-activate-guard";

export const taskRoutes: Routes = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
    },
    {
        path: 'tasks',
        loadComponent: () => import('./tasks/tasks.page').then(m => m.TasksPage)
    }
]