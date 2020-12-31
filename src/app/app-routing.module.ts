import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { FullComponent } from './layouts/full/full.component';
import {AuthGuard} from './auth/auth.guard'

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
