import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentListing } from './pages/student-listing/student-listing';
import { StudentDetails } from './pages/student-details/student-details';
import { StudentCreate } from './pages/student-create/student-create';


const routes: Routes = [
  { path: '', component: StudentListing },
  { path: 'student-details/:id', component: StudentDetails },
  { path: 'student-edit/:id', component: StudentCreate },
  { path: 'student-create', component: StudentCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class StudentManagementModule { }
