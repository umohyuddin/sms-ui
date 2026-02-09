import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { SalaryStructureResponse } from '../../models/SalaryStructureResponse';
import { SalaryStructureService } from '../../services/salary-structure.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-salary-structure-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-structure-listing-table.component.html',
  styleUrl: './salary-structure-listing-table.component.css'
})
export class SalaryStructureListingTableComponent {
  pagination: Pagination<SalaryStructureResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  salaryStructureResponse: SalaryStructureResponse[] = [];
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private salaryStructureService: SalaryStructureService, private logger: LoggerService) { }

  columns = [
    { key: 'employeeType', label: 'Employee Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'effectiveFrom', label: 'Effective From', sortable: true },
    { key: 'effectiveTo', label: 'Effective To', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.getSalaryStructures();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
  this.searchControl.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => {
        // Construct query params dynamically
        const params: any = {};

        if (search && search.trim() !== '') {
          params.employeeTypeName = search.trim(); // search by employee type name
        }

        // optionally, you can add more filters like minSalary, maxSalary, etc.
        // e.g., params.minSalary = this.minSalaryControl.value;

        return this.salaryStructureService.searchSalaryStructures(params);
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        // Your service returns { body, status } because of observeResponse
        this.salaryStructureResponse = response.body;
        this.pagination = new Pagination(this.salaryStructureResponse, 10);
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
}


  getSalaryStructures() {
    this.salaryStructureService.getAllSalaryStructures().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.salaryStructureResponse = response.body;
        this.pagination = new Pagination(this.salaryStructureResponse, 10);
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

  viewSalaryStructureDetails(item: SalaryStructureResponse, event: Event): void {
    console.log('Viewing Salary Structure ID:', item.id);
    event.preventDefault();
    this.router.navigate(ROUTES.SALARY_STRUCTURE.DETAILS(item.id.toString()));
  }

  editSalaryStructure(item: SalaryStructureResponse, field: string, event: Event) {
    console.log('Editing Salary Structure ID:', item.id);
    event.preventDefault();
    this.router.navigate(ROUTES.SALARY_STRUCTURE.EDIT(item.id.toString()),
      { queryParams: { field } }
    )
  }
  closeSalaryStructure(item: SalaryStructureResponse, field: string, event: Event) {
    console.log('Editing Salary Structure ID:', item.id);
    event.preventDefault();
    this.salaryStructureService.closeSalaryStructure(item.id.toString()).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.getSalaryStructures();
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

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}