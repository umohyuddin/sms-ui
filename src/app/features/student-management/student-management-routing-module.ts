import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';




const routes: Routes = [
  { path: '', component: StudentListing },
  { path: 'student-details/:id', component: StudentDetails },
  { path: 'student-create', component: StudentCreate }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class StudentManagementRoutingModule { }



