import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { DepartmentResponse } from '../../models/DepartmentResponse';
import { DepartmentManagementService } from '../../services/DepartmentManagementService';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { PortletHeaderComponent } from '../../../../shared/components/portlet-header/portlet-header.component';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';

@Component({
  selector: 'app-department-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    NoDataComponent,
    PortletHeaderComponent],
  templateUrl: './department-listing-table.component.html',
  styleUrl: './department-listing-table.component.css'
})
export class DepartmentListingTableComponent {

  pagination: Pagination<DepartmentResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  departments: DepartmentResponse[] = [];
  texts = PageTexts.departments;

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private departmentService: DepartmentManagementService) { }

  columns = [
    { key: 'departmentName', label: 'Department Name', sortable: true },
    { key: 'departmentCode', label: 'Department Code', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'parentDepartmentId', label: 'Parent Department', sortable: true },
    { key: 'headEmployeeId', label: 'Head Employee', sortable: true },
    { key: 'isActive', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.getDepartments();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.departmentService.searchDepartments(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          this.departments = response.body;
          this.pagination = new Pagination(this.departments, 10);
        },
        error: error => console.error('Search error:', error)
      });
  }

  getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: response => {
        this.departments = response.body;
        this.pagination = new Pagination(this.departments, 10);
      },
      error: error => console.error('Request Error:', error)
    });
  }

  viewDepartmentDetails(department: DepartmentResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(['/departments/department-details', department.id]);
  }

  editDepartmentDetails(department: DepartmentResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(['/departments/department-edit', department.id]);
  }

  deleteDepartment(departmentId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this Department?')) {
      this.departmentService.deleteDepartment(departmentId).subscribe({
        next: response => {
          console.log(`Department ${departmentId} deleted successfully`);
          this.departments = this.departments.filter(d => d.id !== departmentId);
          this.pagination = new Pagination(this.departments, 10);
        },
        error: error => console.error('Delete Error:', error)
      });
    }
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}