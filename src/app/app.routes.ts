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
    path: 'academic-years',
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
    path: 'employee',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/employee-management/employee-management-module').then(m => m.EmployeeManagementModule)
      }
    ]
  },
  {
    path: 'departments',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/department-management/department-management.module').then(m => m.DepartmentManagementModule)
      }
    ]
  },
  {
    path: 'designations',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/designation-management/designation-management.module').then(m => m.DesignationManagementModule)
      }
    ]
  },
  {
    path: 'employee/types',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/employee-type-management/employee-type-management.module').then(m => m.EmployeeTypeManagementModule)
      }
    ]
  },
  {
    path: 'school/profile',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/school-profile-management/school-profile-management.module').then(m => m.SchoolProfileManagementModule)
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
  {
    path: 'concession/component/rate',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/concession-rate-management/concession-rate-management-module').then(m => m.ConcessionRateManagementModule)
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