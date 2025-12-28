import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { DesignationResponse } from '../models/DesignationResponse';
import { DesignationManagementService } from '../../services/designationManagement.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-designation-listing-table',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './designation-listing-table.component.html',
  styleUrl: './designation-listing-table.component.css'
})
export class DesignationListingTableComponent {
  pagination: Pagination<DesignationResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  designations: DesignationResponse[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private designationService: DesignationManagementService
  ) { }

  columns = [
    { key: 'designationName', label: 'Designation Name' },
    { key: 'designationCode', label: 'Code' },
    { key: 'departmentName', label: 'Department' },
    { key: 'employeeTypeName', label: 'Employee Type' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  ngOnInit(): void {
    this.getDesignations();
    this.subscribeToSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(keyword => this.designationService.searchDesignations(keyword || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          this.designations = response.body;
          this.pagination = new Pagination(this.designations, 10);
        },
        error: err => console.error('Search error:', err)
      });
  }

  getDesignations(): void {
    this.designationService.getAllDesignations().subscribe({
      next: response => {
        this.designations = response.body;
        this.pagination = new Pagination(this.designations, 10);
      },
      error: err => console.error('Fetch error:', err)
    });
  }

  viewDetails(item: DesignationResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.DESIGNATIONS.DETAILS(item.id.toString()));
  }

  editDetails(item: DesignationResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.DESIGNATIONS.EDIT(item.id.toString()));
  }

  onPageSizeChange(event: any): void {
    this.pagination.changePageSize(+event.target.value);
  }
}