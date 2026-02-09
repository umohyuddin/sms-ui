import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { RECURRENCE_RULE_CLASSES, CHARGE_TYPE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { Pagination } from '../../../../core/pagar/pagination';
import { FeeCatalogResponse as EmployeeTypeResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';
import { EmployeeTypeService } from '../../services/employee-type.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-type-listing-table',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employee-type-listing-table.component.html',
  styleUrl: './employee-type-listing-table.component.css'
})
export class EmployeeTypeListingTableComponent {
  pagination: Pagination<EmployeeTypeResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  response: EmployeeTypeResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private empTypeManagementService: EmployeeTypeService,
   private logger: LoggerService) { }

  columns = [
    { key: 'empTypeName', label: 'Employee Type', sortable: true },
    { key: 'empTypeDescription', label: 'Description', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.getEmployeeTypes();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.empTypeManagementService.searchEmployeeType(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.response = response.body;
          this.pagination = new Pagination(this.response, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  getEmployeeTypes() {
    this.empTypeManagementService.getAllEmployeeType().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.response = response.body;
        this.pagination = new Pagination(this.response, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }

  viewDetails(item: EmployeeTypeResponse, event: Event): void {
    console.log('Viewing details for Resoruce ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.EMPLOYEE_TYPE.DETAILS(item.id.toString()));
  }

  editDetails(item: EmployeeTypeResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Resoruce ID:', item.id);
    this.router.navigate(ROUTES.EMPLOYEE_TYPE.EDIT(item.id.toString()));
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
