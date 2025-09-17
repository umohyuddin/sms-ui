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
import { InstituteProfileComponent } from './fragment/generalSetting/institute-profile/institute-profile.component';
import { authGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RulesAndRegulationsComponent } from './fragment/generalSetting/rules-and-regulations/rules-and-regulations.component';
import { ThemeComponent } from './fragment/generalSetting/theme/theme.component';
import { FeesParticularsComponent } from './fragment/generalSetting/fees-particulars/fees-particulars.component';
import { MarksGradingComponent } from './fragment/generalSetting/marks-grading/marks-grading.component';
import { AccountSettingsComponent } from './fragment/generalSetting/account-settings/account-settings.component';
import { FeeChallanDetailsComponent } from './fragment/generalSetting/fee-challan-details/fee-challan-details.component';
import { DashboardComponent } from './fragment/dashboard/dashboard.component';
import { CampusProfileComponent } from './fragment/generalSetting/campus-profile/campus-profile.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sigup', component: SignupComponent },
  { path: 'page/404', component: UnauthorizedComponent },

  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: '', component: DashboardComponent },
      {
        path: 'gs',
        children: [
          {path: '', component: InstituteProfileComponent},
          { path: 'accountSettings', component: AccountSettingsComponent },
          { path: 'instituteProfile', component: InstituteProfileComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
          { path: 'campusProfile', component: CampusProfileComponent},
          { path: 'rulesAndRegulations', component: RulesAndRegulationsComponent },
          { path: 'feesParticulars', component: FeesParticularsComponent },
          { path: 'feeChallanDetails', component: FeeChallanDetailsComponent},
          { path: 'marksGrading', component: MarksGradingComponent},
          { path: 'theme', component: ThemeComponent }
        ]
      },
      {
        path: 'u',
        children:[
          { path: 'user', component: UserComponent },
          { path: 'userRole', component: UserRoleComponent }
        ]
      },
      {
        path: 'inst',
        children: [
          { path: 'campus', component: CampusComponent },
          { path: 'institute', component: InstituteComponent },
          { path: 'department', component: DepartmentComponent },
          {path: 'inventory', component: InventoryComponent }
        ]
      },
      {
        path: 'emp',
        children:[
          {path: 'employee', component: EmployeeComponent },
          {path: 'employeeRole', component: EmploeeRoleComponent },
          {path: 'salary', component: SalaryComponent },
          {path: 'employeeAttendance', component: EmploeeAttendanceComponent },
          {path: 'teacher', component: TeacherComponent }
        ]
      },
      {
        path: 'std',
        children: [
          {path: 'student', component: StudentComponent },
          {path: 'fee', component: FeeComponent },
          {path: 'attendance', component: AttendanceComponent }
        ]
      },
      {
        path:'c',
        children:[
          {path: 'course', component: CourseComponent },
          {path: 'class', component: ClassComponent },
          {path: 'enrollment', component: EnrollmentComponent },
          {path: 'assessment', component: AssessmentComponent }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }

];
