import { Routes } from "@angular/router";
//import { leavePageGuard } from "../shared/guards/leave-page-guard";
//import { numericIdGuard } from "../shared/guards/numeric-id-guard";
//import { loginActivateGuard } from "../shared/guards/login-activate-guard";

export const taskRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./tasks/tasks.page').then(m => m.TasksPage)
    },
    {
        path: 'add',
        loadComponent: () => import('./task-form/task-form.page').then(m => m.TaskFormPage)
    },
    {
        path: ':id',
        loadComponent: () => import('./task-details/task-details.page').then(m => m.TaskDetailsPage),
        loadChildren: () => import('./task-details/tasks-details.routes').then(m => m.TaskDetailsRoutes)
    }

]