import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';

import { EmployeeSalaryService } from '../../services/employee-salary.service';
import { EmployeeSalaryFullResponse } from '../../models/EmployeeSalary';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-employee-salary-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './employee-salary-listing-table.component.html',
  styleUrls: ['./employee-salary-listing-table.component.css']
})
export class EmployeeSalaryListingTableComponent implements OnInit {
  pagination: Pagination<EmployeeSalaryFullResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  employeeSalaries: EmployeeSalaryFullResponse[] = [];
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private employeeSalaryService: EmployeeSalaryService,
  ) { }

  columns = [
    { key: 'employeeCode', label: 'Employee Code', sortable: true },
    { key: 'employeeName', label: 'Employee Name', sortable: true },
    { key: 'employeeType', label: 'Employee Type', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'grossSalary', label: 'Gross Salary', sortable: true },
    { key: 'totalDeductions', label: 'Total Deductions', sortable: true },
    { key: 'netSalary', label: 'Net Salary', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'effectiveDate', label: 'Effective Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.getEmployeeSalaries();
    //this.subscribeToSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // private subscribeToSearch() {
  //   this.searchControl.valueChanges
  //     .pipe(
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       switchMap(search => this.employeeSalaryService.searchEmployeeSalaries(search || '')),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.employeeSalaries = response.body;
  //         this.pagination = new Pagination(this.employeeSalaries, 10);
  //       },
  //       error: (error) => {
  //         console.error('Search error:', error);
  //       }
  //     });
  // }

  getEmployeeSalaries() {
    this.employeeSalaryService.getAllEmployeeSalaries().subscribe({
      next: (response) => {
        console.log('Success Status:', response.status);
        console.log('Response Body:', response.body);
        this.employeeSalaries = response.body;
        this.pagination = new Pagination(this.employeeSalaries, 10);
      },
      error: (error) => {
        console.error('Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('Request Complete');
      }
    })
  }

  viewDetails(item: EmployeeSalaryFullResponse, event: Event): void {
    console.log('Viewing details for Salary ID:', item.salaryId);
    event.preventDefault();
    if (!item.employeeId) {
      console.error('Salary ID is missing!');
      return;
    }

    this.router.navigate(ROUTES.EMPLOYEE_SALARY.DETAILS(item.employeeId.toString()),
      {
        queryParams: {
          salaryId: item.salaryId,
          mode: 'view'
        }
      });
  }

  payNow(item: EmployeeSalaryFullResponse, event: Event): void {
    event.preventDefault();
    console.log('Editing Salary ID:', item.salaryId);
    if (!item.employeeId) {
      console.error('Salary ID is missing!');
      return;
    }
    console.log('Editing Salary ID:', item.salaryId);
    this.router.navigate(ROUTES.EMPLOYEE_SALARY.DETAILS(item.employeeId.toString()),
      {
        queryParams: {
          salaryId: item.salaryId,
          mode: 'pay'
        }
      });
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
