import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { InstituteFacilityResponse } from '../../models/InstituteFacilityResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-institute-facility-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToasterComponent, DeletePopupComponent],
  templateUrl: './institute-facility-listing-table.component.html',
  styleUrl: './institute-facility-listing-table.component.css'
})
export class InstituteFacilityListingTableComponent implements OnChanges {
  @Input() instituteId?: number;
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  pagination: Pagination<InstituteFacilityResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  facilities: InstituteFacilityResponse[] = [];
  isLoading = false;
  isDeletePopupOpen = false;
  pendingDeleteId?: number;

  private destroy$ = new Subject<void>();

  constructor(private schoolProfileManagementService: SchoolProfileManagementService) {}

  columns = [
    { key: 'name', label: 'Facility Name', sortable: true },
    { key: 'facilityTypeName', label: 'Type', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: false },
    // { key: 'location', label: 'Location', sortable: false },
    // { key: 'isActive', label: 'Status', sortable: true },
    // { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.refreshFacilities();
    this.subscribeToSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituteId']) {
      this.refreshFacilities();
    }
  }

  private refreshFacilities() {
    this.isLoading = true;
    const instituteId = this.instituteId;
    if (!instituteId) {
      this.isLoading = false;
      return;
    }

    this.getFacilitiesByInstituteId(instituteId);
  }

  reloadFacilities(): void {
    this.refreshFacilities();
  }

  private getFacilitiesByInstituteId(instituteId: number) {
    this.schoolProfileManagementService.getInstituteFacilitiesByInstituteId(instituteId).subscribe({
      next: (response: any) => this.applyFacilitiesResponse(response.body),
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Request Error Status:', error.status, 'Message:', error.message);
        this.toaster?.show('Failed to load facilities.', 'error');
      },
      complete: () => (this.isLoading = false)
    });
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((search) => {
          const keyword = search || '';
          this.isLoading = true;
          const instituteId = this.instituteId;
          if (!instituteId) {
            this.isLoading = false;
            return [] as any;
          }
          if (keyword) {
            return this.schoolProfileManagementService.searchFacilities(instituteId, keyword);
          }
          return this.schoolProfileManagementService.getInstituteFacilitiesByInstituteId(instituteId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: any) => {
          this.applyFacilitiesResponse(response.body);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Search error:', error);
          this.toaster?.show('Search failed.', 'error');
        }
      });
  }

  private applyFacilitiesResponse(body: any) {
    const data: InstituteFacilityResponse[] = body?.content ?? body ?? [];
    this.facilities = data;
    this.pagination = new Pagination(this.facilities, 10);
  }

  deleteFacility(facilityId: number, event: Event): void {
    event.stopPropagation();
    this.pendingDeleteId = facilityId;
    this.isDeletePopupOpen = true;
  }

  confirmDelete(): void {
    if (!this.pendingDeleteId) {
      this.isDeletePopupOpen = false;
      return;
    }

    this.isDeletePopupOpen = false;
    this.isLoading = true;

    this.schoolProfileManagementService.deleteFacility(this.pendingDeleteId).subscribe({
      next: () => {
        this.refreshFacilities();
        this.toaster?.show('Facility deleted successfully.', 'success');
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Delete Error Status:', error.status, 'Message:', error.message);
        this.toaster?.show('Failed to delete facility.', 'error');
      }
    });
  }

  cancelDelete(): void {
    this.isDeletePopupOpen = false;
    this.pendingDeleteId = undefined;
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
