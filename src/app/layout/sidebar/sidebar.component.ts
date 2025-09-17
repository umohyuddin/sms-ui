import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global/global.service';
import path from 'path';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private gsr: GlobalService
  ) {
  }
  activeMenu: string | null = 'dashboard';
  toggleMenu: string | null = null;
  menuItems: any[] = [];

  ngOnInit(): void {
    this.menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon:'fas fa-th-large me-2',
      path: '',
      perm:true,
      isExpandable: false,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'fas fa-cog me-2',
      path: 'gs',
      perm:true,
      isExpandable: true,
      children: [
        { label: 'Institute Profile', path: 'instituteProfile', icon:'fas fa-user-circle me-2', perm: this.gsr.isAdmin() },
        { label: 'Campus Profile', path: 'campusProfile', icon:'fa fa-university me-2', perm:true },
        { label: 'Fees Particulars', path: 'feesParticulars', icon: 'fas fa-file-invoice-dollar me-2' , perm:true },
        { label: 'Fee Challan Details', path: 'feeChallanDetails', icon: 'fas fa-money-bill-alt me-2', perm:true },
        { label: 'Account Settings', path: 'accountSettings', icon: 'fas fa-cog me-2', perm:true },
        { label: 'Rules & Regulation', path: 'rulesAndRegulations', icon:'fas fa-balance-scale me-2' , perm:true },
        { label: 'Marks Grading', path: 'marksGrading', icon:'fas fa-list-ol me-2', perm:true },
        { label: 'Theme Settings', path: 'theme', icon:'fas fa-language me-2' , perm:true }
      ]
    },
    {
      id: 'users',
      label: 'User',
      icon:'fas fa-user-circle me-2',
      path: 'u',
      perm:true,
      isExpandable: true,
      children: [
        { label: 'User', path: 'user', icon:'fas fa-user-circle me-2', perm:true },
        { label: 'User Role', path: 'userRole', icon:'fa fa-user-secret me-2', perm:true }
      ]
    },
    {
      id: 'instituteid',
      label: 'Institute',
      icon:'fa fa-building me-2',
      path: 'inst',
      perm:true,
      isExpandable: true,
      children: [
        { label: 'Institute', path: 'institute', icon:'fa fa-building me-2', perm:true },
        { label: 'Campus', path: 'campus', icon:'fa fa-hospital me-2', perm:true },
        { label: 'Department', path: 'department', icon:'fa fa-building me-2', perm:true },
        { label: 'Inventory', path: 'inventory', icon:'fa fa-suitcase me-2', perm:true }
      ]
    },
    {
      id: 'employee',
      label: 'Employee',
      icon:'fa fa-male me-2',
      path: 'emp',
      perm:true,
      isExpandable: true,
      children: [
        { label: 'Employee', path: 'employee', icon:'fa fa-male me-2', perm:true },
        { label: 'Employee Role', path: 'employeeRole', icon:'fa fa-arrows me-2', perm:true },
        { label: 'Salary', path: 'salary', icon:'fas fa-file-invoice-dollar me-2', perm:true },
        { label: 'Employee Attendance', path: 'employeeAttendance', icon:'fa fa-table me-2', perm:true },
        { label: 'Teacher', path: 'teacher', icon:'fa fa-graduation-cap me-2', perm:true }
      ]
    },
    {
      id: 'student',
      label: 'Student',
      icon:'fas fa-user-circle me-2',
      path: 'std',
      perm:true,
      isExpandable: true,
      children: [
        { label: 'Student', path: 'student', icon:'fas fa-user-circle me-2', perm:true },
        { label: 'Fee', path: 'fee', icon:'fas fa-money-bill-alt me-2', perm:true },
        { label: 'Attendance', path: 'attendance', icon:'fa fa-table me-2', perm:true }
      ]
    },
    {
      id: 'course',
      label: 'Course',
      icon:'fas fa-book me-2',
      path: 'c',
      perm:true,
      isExpandable: true,
      children: [
        { label: 'Course', path: 'course', icon:'fas fa-book me-2', perm:true },
        { label: 'Class', path: 'class', icon:'fas fa-users me-2', perm:true },
        { label: 'Enrollment', path: 'enrollment', icon:'fa fa-sitemap me-2', perm:true },
        { label: 'Assessment', path: 'assessment', icon:'fa fa-check-square me-2', perm:true }
      ]
    }
  ];
    // get the current path without query or fragment
    const currentUrl = this.router.url.replace(/^\/dashboard\//, '');
    // console.log(currentUrl);

    // find the top-level menu item whose child or own path matches
    for (const item of this.menuItems) {
      if (!item.isExpandable) {
        if (currentUrl.startsWith(item.path) && item.path.length>0) {
          this.activeMenu = item.id;
          return;
        }
      } else if (item.children?.length) {
        const match = item.children.find((child: { path: string; }) =>
          currentUrl.startsWith(item.path + '/' + child.path)
        );
        if (match) {
          this.activeMenu = item.id;   // highlight parent
          this.toggleMenu = item.id;   // keep it open
          return;
        }
      }
    }
  }

  setToggleMenu(id: string) {
    this.toggleMenu =  this.toggleMenu === id ? null : id;
  }

  setActiveMenu(id: string) {
    // console.log(id);
    this.activeMenu = id;
  }

  setActiveAndToggleMenu(pActive: string, pToggle: string) {
    this.activeMenu =  this.activeMenu === pActive ? null : pActive;
    this.toggleMenu = this.toggleMenu === pToggle ? null : pToggle;
  }
}
