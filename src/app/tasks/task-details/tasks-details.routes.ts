import { Routes } from "@angular/router";
//import { leavePageGuard } from "../shared/guards/leave-page-guard";
//import { numericIdGuard } from "../shared/guards/numeric-id-guard";
//import { loginActivateGuard } from "../shared/guards/login-activate-guard";

export const TaskDetailsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
    },
    {
        path: 'info',
        loadComponent: () => import('../task-details-info/task-details-info.page').then(m => m.TaskDetailsInfoPage)
    },
    {
        path: 'comments',
        loadComponent: () => import('../task-details-comments/task-details-comments.page').then(m => m.TaskDetailsCommentsPage)
    }
]