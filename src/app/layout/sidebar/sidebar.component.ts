import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  menuItems = [
    { label: 'User', path: 'users' },
    { label: 'User Role', path: 'userRole' },
    { label: 'Campus', path: 'campus' },
    { label: 'Institute', path: 'institute' },
    { label: 'Department', path: 'department' },
    { label: 'Inventory', path: 'inventory' },
    { label: 'Employee', path: 'employee' },
    { label: 'Employee Role', path: 'employeeRole' },
    { label: 'Salary', path: 'salary' },
    { label: 'Employee Attendance', path: 'employeeAttendance' },
    { label: 'Teacher', path: 'teacher' },
    { label: 'Student', path: 'student' },
    { label: 'Fee', path: 'fee' },
    { label: 'Attendance', path: 'attendance' },
    { label: 'Course', path: 'course' },
    { label: 'Class', path: 'class' },
    { label: 'Enrollment', path: 'enrollment' },
    { label: 'Assessment', path: 'assessment' }
  ];

   activePage: string = '';

  constructor(private router: Router) {}

  selectPage(pagePath: string) {
    this.activePage = pagePath;
    this.router.navigate([`/home/${pagePath}`]);
  }
}
