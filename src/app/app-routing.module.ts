import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { FullComponent } from './layouts/full/full.component';
import {AuthGuard} from './auth/auth.guard'
import { SuperAdminDashboardComponent } from './dashboard/super-admin-dashboard/super-admin-dashboard.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import { SupervisorDashboardComponent } from './dashboard/supervisor-dashboard/supervisor-dashboard.component';
import { NotificationsComponent } from './notifications/notifications.component';
export const Approutes: Routes = [

  {
    
    path: '',
    component: FullComponent,
    children: [
      
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[AuthGuard]
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule), canActivate:[AuthGuard]
      }
    ]
  },
  {path:'login', component:LoginComponent },
  
 
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
