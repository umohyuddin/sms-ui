import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 🔓 Public routes (no guard)
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth-module')
            .then(m => m.AuthModule)
      }
    ]
  },


  // 🔒 Protected routes (require authentication)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  },

  {
    path: 'tenants',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/tenant-management/tenant-management-module').then(m => m.TenantManagementModule)
      }
    ]
  },
  {
    path: 'campuses',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/campus-management/campus-management-module').then(m => m.CampusManagementModule)
      }
    ]
  },
  {
    path: 'campuses/standards',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/standard-management/standard-management-module').then(m => m.StandardManagementModule)
      }
    ]
  },
  {
    path: 'campuses/standards/sections',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/section-management/section-management-module').then(m => m.SectionManagementModule)
      }
    ]
  },
  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/student-management/student-management-module').then(m => m.StudentManagementModule)
      }
    ]
  },
  {
    path: 'fee/catalog',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/fee-catalog-management/fee-catalog-management-module').then(m => m.FeeCatalogManagementModule)
      }
    ]
  },
  {
    path: 'fee/catalog/component',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/fee-catalog-component-management/fee-catalog-component-management-module').then(m => m.FeeCatalogComponentManagementModule)
      }
    ]
  },
  {
    path: 'fee/catalog/component/rate',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/fee-rate-management/fee-rate-management-module').then(m => m.FeeRateManagementModule)
      }
    ]
  },
  {
    path: 'concession/catalog',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/concession-management/concession-management-module').then(m => m.ConcessionManagementModule)
      }
    ]
  },
    {
    path: 'concession/catalog/component',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/concession-component-management/concession-component-management-module').then(m => m.ConcessionComponentManagementModule)
      }
    ]
  },

  // Default redirect
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];