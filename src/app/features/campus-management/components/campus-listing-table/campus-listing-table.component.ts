import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { CampusManagementService } from '../../services/campus-management.service';
import { CampusResponse } from '../../models/campusResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-campus-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './campus-listing-table.component.html',
  styleUrls: ['./campus-listing-table.component.css']
})
export class CampusListingTableComponent {
  texts = PageTexts.campus;
  pagination: Pagination<CampusResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  campuses: CampusResponse[] = [];

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private campusManagementService: CampusManagementService,
  ) { }

  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'campusCode', label: 'Campus Code', sortable: true },
    { key: 'contactNumber', label: 'Contact Number', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'website', label: 'Web Site', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getCampuses();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.campusManagementService.searchCampuses(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.campuses = response.body;
          this.pagination = new Pagination(this.campuses, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campuses = response.body || [];
        this.pagination = new Pagination(this.campuses, 10);
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

  viewCampusDetails(campus: CampusResponse, event: Event): void {
    console.log('Viewing details for Campus ID:', campus.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CAMPUS.DETAILS(campus.id.toString()));
  }

  editCampusDetails(campus: CampusResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Campus ID:', campus.id);
    this.router.navigate(ROUTES.CAMPUS.EDIT(campus.id.toString()));
  }

  deleteCampus(campusId: any, event: Event): void {
    event.stopPropagation();

    console.log('Deleting Campus:', campusId);
    if (confirm('Are you sure you want to delete this Campus?')) {

      this.campusManagementService.deleteCampus(campusId).subscribe({
        next: (response) => {
          console.log('  Delete Success Status:', response.status);
          console.log('📦 Delete Response Body:', response.body);
          // this.CampusData = this.CampusData.filter(t => t.CampusId !== CampusId);
          console.log(`Campus ${campusId} deleted successfully`);
        },
        error: (error) => {
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Delete Complete');
        }
      })
    }
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
