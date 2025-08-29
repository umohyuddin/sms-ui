import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserComponent } from './fragment/user/user.component'
import { UserRoleComponent } from './fragment/user-role/user-role.component'
import { CampusComponent } from './fragment/campus/campus.component'
import { InstituteComponent } from './fragment/institute/institute.component'
import { DepartmentComponent } from './fragment/department/department.component';
import { InventoryComponent } from './fragment/inventory/inventory.component';
import { EmployeeComponent } from './fragment/employee/employee.component';
import { EmploeeRoleComponent } from './fragment/employee-role/employee-role.component';
import { SalaryComponent } from './fragment/salary/salary.component';
import { EmploeeAttendanceComponent } from './fragment/employee-attendance/employee-attendance.component';
import { TeacherComponent } from './fragment/teacher/teacher/teacher.component';
import { StudentComponent } from './fragment/student/student.component';
import { FeeComponent } from './fragment/fee/fee.component';
import { AttendanceComponent } from './fragment/attendance/attendance.component';
import { CourseComponent } from './fragment/course/course.component';
import { ClassComponent } from './fragment/class/class.component';
import { EnrollmentComponent } from './fragment/enrollment/enrollment.component';
import { AssessmentComponent } from './fragment/assessment/assessment.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sigup', component: SignupComponent },

  {
    path: 'home',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {path: 'users', component: UserComponent},
      { path: 'userRole', component: UserRoleComponent },
      { path: 'campus', component: CampusComponent },
      { path: 'institute', component: InstituteComponent },
      { path: 'department', component: DepartmentComponent},
      {path: 'inventory', component: InventoryComponent},
      {path: 'employee', component: EmployeeComponent},
      {path: 'employeeRole', component: EmploeeRoleComponent},
      {path: 'salary', component: SalaryComponent},
      {path: 'employeeAttendance', component: EmploeeAttendanceComponent},
      {path: 'teacher', component: TeacherComponent},
      {path: 'student', component: StudentComponent},
      {path: 'fee', component: FeeComponent},
      {path: 'attendance', component: AttendanceComponent},
      {path: 'course', component: CourseComponent},
      {path: 'class', component: ClassComponent},
      {path: 'enrollment', component: EnrollmentComponent},
      {path: 'assessment', component: AssessmentComponent}

    ]
  },
  { path: '**', redirectTo: 'login' }

];
