import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { SectionResponse } from '../../../section-management/models/SectionResponse';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { GENDER_CLASSES, MARITAL_STATUS_CLASSES } from '../../../../core/const/COLOR_CONST';


@Component({
  selector: 'app-employee-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './employee-listing-table.component.html',
  styleUrls: ['./employee-listing-table.component.css']
})
export class EmployeeListingTableComponent {
  pagination: Pagination<EmployeeResponse> = new Pagination([], 10);
  employeeResponse: EmployeeResponse[] = [];
  genderClasses = GENDER_CLASSES;
  martial_Status = MARITAL_STATUS_CLASSES;

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeManagementService: EmployeeManagementService,
  ) { }


  columns = [
    // Basic Info
    { key: 'employeeCode', label: 'Employee Code' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'firstName', label: 'First Name' },
    { key: 'middleName', label: 'Middle Name' },
    { key: 'lastName', label: 'Last Name' },

    // Contact Info
    { key: 'email', label: 'Email' },
    { key: 'primaryPhone', label: 'Primary Phone' },
    { key: 'secondaryPhone', label: 'Secondary Phone' },
    { key: 'workPhone', label: 'Work Phone' },

    // Personal Info
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { key: 'religion', label: 'Religion' },


    // Employment Info
    { key: 'joiningDate', label: 'Joining Date', type: 'date' },
    { key: 'probationEndDate', label: 'Probation End Date', type: 'date' },
    { key: 'employeeType', label: 'Employee Type' },
    // Status
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'action', label: 'Actions', type: 'boolean' }
  ];


  ngOnInit() {
    this.getAllEmployee();
    this.SubscribeToSearch();
  }


  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.employeeManagementService.searchEmployee(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.employeeResponse = response.body;
          this.pagination = new Pagination(this.employeeResponse, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }


  getAllEmployee() {
    this.employeeManagementService.getAllEmployee().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeResponse = response.body;
        this.pagination = new Pagination(this.employeeResponse, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });

  }
  viewStudentDetails(employee: EmployeeResponse, event: Event): void {
    console.log('Viewing details for employee ID:', employee.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.EMPLOYEE.DETAILS(employee.id.toString()));
  }

  editStudentDetails(employee: EmployeeResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing employee ID:', employee.id);
    this.router.navigate(ROUTES.EMPLOYEE.EDIT(employee.id.toString()));
  }


  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  assignEmoloyeeSalary(employee: EmployeeResponse, event: Event) {
    event.preventDefault();
    this.router.navigate(ROUTES.EMPLOYEE.ASSIGN_SALARY(employee.employeeTypeId.toString()),
      { queryParams: { employeeId: employee.id } })
  }

  manageEmployeeDepartment(employee: EmployeeResponse, event: Event){
    event.preventDefault();
    this.router.navigate(ROUTES.EMPLOYEE.ASSIGN_DEPARTMENT(employee.id.toString()),
      { queryParams: { employeeId: employee.id } })

  }
}
