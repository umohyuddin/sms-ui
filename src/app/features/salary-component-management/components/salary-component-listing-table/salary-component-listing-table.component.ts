import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { SalaryComponentResponse } from '../../models/SalaryComponent';
import { SalaryComponentService } from '../../services/salary-component.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES } from '../../../../core/const/COLOR_CONST';

@Component({
  selector: 'app-salary-component-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './salary-component-listing-table.component.html',
  styleUrls: ['./salary-component-listing-table.component.css']
})
export class SalaryComponentListingTableComponent implements OnInit {
  pagination: Pagination<SalaryComponentResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  salaryComponents: SalaryComponentResponse[] = [];
  private destroy$ = new Subject<void>();
  

  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  constructor(private router: Router,
    private salaryComponentService: SalaryComponentService,
   private logger: LoggerService) { }

  columns = [
    { key: 'name', label: 'Component Name', sortable: true },
    { key: 'isPercentage', label: 'Charge Type', sortable: true },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  getChargeTypeFromPercentage(item: any): string {
  if (item?.isPercentage === true) {
    return 'PERCENTAGE';
  }
  if (item?.isPercentage === false) {
    return 'FIXED';
  }
  return 'NONE';
}
  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.getSalaryComponents();
    this.subscribeToSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.salaryComponentService.searchSalaryComponents(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.salaryComponents = response.body;
          this.pagination = new Pagination(this.salaryComponents, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  getSalaryComponents() {
    this.salaryComponentService.getAllSalaryComponents().subscribe({
      next: (response) => {
        console.log('Success Status:', response.status);
        console.log('Response Body:', response.body);
        this.salaryComponents = response.body;
        this.pagination = new Pagination(this.salaryComponents, 10);
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

  viewDetails(item: SalaryComponentResponse, event: Event): void {
    console.log('Viewing details for Component ID:', item.id);
    event.preventDefault();
    this.router.navigate(ROUTES.SALARY_COMPONENT.DETAILS(item.id.toString()));
  }

  editDetails(item: SalaryComponentResponse, event: Event): void {
    event.preventDefault();
    console.log('Editing Component ID:', item.id);
    this.router.navigate(ROUTES.SALARY_COMPONENT.EDIT(item.id.toString()));
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
