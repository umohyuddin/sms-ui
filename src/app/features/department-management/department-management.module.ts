import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentListingComponent } from './pages/department-listing/department-listing.component';
import { DepartmentDetailsComponent } from './pages/department-details/department-details.component';
import { DepartmentCreateComponent } from './pages/department-create/department-create.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: DepartmentListingComponent },
  { path: 'department-details/:id', component: DepartmentDetailsComponent },
  { path: 'department-edit/:id', component: DepartmentCreateComponent },
  { path: 'department-create', component: DepartmentCreateComponent }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)
  ]
})
export class DepartmentManagementModule { }
