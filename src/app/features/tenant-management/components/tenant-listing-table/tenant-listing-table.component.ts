import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { Pagination } from '../../../../core/pagar/pagination';
import { AcademicYearResponse } from '../../models/AcademicYearResponse';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AcademicYearManagementService } from '../../services/academic-year-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
@Component({
  selector: 'app-tenant-listing-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tenant-listing-table.component.html',
  styleUrls: ['./tenant-listing-table.component.css']
})
export class TenantListingTableComponent {
  pagination: Pagination<AcademicYearResponse> = new Pagination([], 10);
  academicYears: AcademicYearResponse[] = [];
  constructor(
    private academicYearService: AcademicYearManagementService
  ) { }

  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();

  columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { key: 'Total Months', label: 'End Date', sortable: true },
    { key: 'isCurrent', label: 'Current', sortable: true },
    // { key: 'actions', label: 'Actions', sortable: true }
  ];
  ngOnInit() {
    this.getAcademicYears();
    this.subscribeToSearch();
  }



  getAcademicYears() {
    this.academicYearService.getAcademicYears().subscribe({
      next: (response) => {
        console.log('📦 Academic Years:', response.body);
        this.academicYears = response.body;
        this.pagination = new Pagination(this.academicYears, 10);
      },
      error: (error) => {
        console.error('❌ Error loading academic years:', error.message);
      }
    });
  }

  viewAcademicYear(academicYear: AcademicYearResponse, event: Event) {
    event.preventDefault();
    console.log('Viewing Academic Year ID:', academicYear.id);
    //this.router.navigate(ROUTES.DETAILS(academicYear.id.toString()));
  }

  editAcademicYear(academicYear: AcademicYearResponse, event: Event) {
    event.preventDefault();
    console.log('Editing Academic Year ID:', academicYear.id);
    //this.router.navigate(ROUTES.CAMPUS.ACADEMIC_YEAR.EDIT(academicYear.id.toString()));
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.academicYearService.searchAcademicYears({ keyword: search || '' })),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.academicYears = response.body;
          this.pagination = new Pagination(this.academicYears, 10);
        },
        error: (error) => console.error('❌ Search Error:', error)
      });
  }

  onPageSizeChange(event: any) {
    this.pagination.changePageSize(+event.target.value);
  }
}
