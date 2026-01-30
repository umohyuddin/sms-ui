import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { AcademicYearResponse } from '../../models/AcademicYearResponse';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AcademicYearManagementService } from '../../services/academic-year-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
@Component({
  selector: 'app-tenant-listing-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './tenant-listing-table.component.html',
  styleUrls: ['./tenant-listing-table.component.css']
})
export class TenantListingTableComponent {
  @ViewChild('toaster') toaster!: ToasterComponent;
  loading: boolean = false;
  pagination: Pagination<AcademicYearResponse> = new Pagination([], 10);
  academicYears: AcademicYearResponse[] = [];
  constructor(
    private router: Router,
    private academicYearService: AcademicYearManagementService
  ) { }

  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();

  columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { key: 'totalMonths', label: 'Total Months', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'isCurrent', label: 'Current', sortable: true },
    { key: 'isLocked', label: 'Locked', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.getAcademicYears();
    this.subscribeToSearch();
  }

  editDetails(academic_year: AcademicYearResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    if (academic_year.id === undefined) {
      console.error('Campus ID is undefined');
      return;
    }
    console.log('Editing Campus ID:', academic_year.id);
    this.router.navigate(ROUTES.ACADEMIC_YEAR.EDIT(academic_year.id.toString()));
  }

  getAcademicYears() {
    this.loading = true;
    this.academicYearService.getAcademicYears().subscribe({
      next: (response) => {
        console.log('📦 Academic Years:', response.body);
        this.academicYears = response.body;
        this.pagination = new Pagination(this.academicYears, 10);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading academic years:', error.message);
        this.loading = false;
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

delete(academicYear: AcademicYearResponse, event: Event): void {
  event.stopPropagation();

  if (!academicYear?.id) {
     this.toaster.show('Invalid Academic Year selected');
    return;
  }

  // UX-level guard
  if (academicYear.isCurrent) {
      this.toaster.show('Current Academic Year cannot be deleted');
    return;
  }

  // Optional: locked year guard
  if (academicYear.isLocked) {
     this.toaster.show('Locked Academic Year cannot be deleted');
    return;
  }

  // const confirmed = confirm(
  //   `Are you sure you want to delete "${academicYear.name}"?\nThis action cannot be undone.`
  // );

  // if (!confirmed) {
  //   return;
  // }

  this.academicYearService.deleteAcademicYear(academicYear.id.toString()).subscribe({
    next: () => {
      this.toaster.show(
        `Academic Year "${academicYear.name}" deleted successfully`
      );

      // Refresh list
      this.getAcademicYears();
    },
    error: (error) => {
      const message =
        error?.error?.message ||
        'Failed to delete Academic Year. Please try again.';

       this.toaster.show(message);
    }
  });
}


  activateAcademicYear(academicYear: AcademicYearResponse, event: Event) {

    event.stopPropagation();

    if (!academicYear?.id) {
      this.toaster.show('Invalid Academic Year selected', 'error');
      return;
    }
    if (academicYear.isCurrent) {
      this.toaster.show('This academic year is already current', 'info');
      return;
    }

    this.academicYearService.activateAcademicYear(academicYear.id.toString()).subscribe({
      next: () => {
        this.toaster.show(
          `Academic Year "${academicYear.name}" activated successfully`
        );

        // Reload list / refresh state
        this.getAcademicYears();
      },
      error: (error) => {
        const message =
          error?.error?.message ||
          'Failed to activate Academic Year. Please try again.';

        this.toaster.show(message);
      }
    });

  }

  viewDetails(academicYear: AcademicYearResponse, event: Event) {

  }
}
