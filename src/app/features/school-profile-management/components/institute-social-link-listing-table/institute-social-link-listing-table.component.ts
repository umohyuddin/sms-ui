import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { InstituteSocialLinkResponse } from '../../models/InstituteSocialLinkResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-institute-social-link-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent, DeletePopupComponent],
  templateUrl: './institute-social-link-listing-table.component.html',
  styleUrl: './institute-social-link-listing-table.component.css'
})
export class InstituteSocialLinkListingTableComponent implements OnChanges {
  @Input() instituteId?: number;
  @Input() organizationId?: number;
  @Output() socialLinkEdit = new EventEmitter<number>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  pagination: Pagination<InstituteSocialLinkResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  socialLinks: InstituteSocialLinkResponse[] = [];
  isLoading = false;

  isDeletePopupOpen = false;
  pendingDeleteId?: number;

  private destroy$ = new Subject<void>();

  constructor(private schoolProfileManagementService: SchoolProfileManagementService) {}

  columns = [
    { key: 'platform', label: 'Platform', sortable: true },
    { key: 'url', label: 'URL', sortable: false },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.refreshSocialLinks();
    this.subscribeToSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituteId']) {
      this.refreshSocialLinks();
    }
  }

  private refreshSocialLinks() {
    this.isLoading = true;
    const instituteId = this.instituteId;
    if (!instituteId) {
      this.isLoading = false;
      return;
    }

    this.getSocialLinksByInstituteId(instituteId);
  }

  reloadSocialLinks(): void {
    this.refreshSocialLinks();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          const keyword = search || '';
          this.isLoading = true;
          const instituteId = this.instituteId;
          if (!instituteId) {
            this.isLoading = false;
            return [] as any;
          }
          if (keyword) {
            return this.schoolProfileManagementService.searchInstituteSocialLinks(instituteId, keyword);
          }
          return this.schoolProfileManagementService.getInstituteSocialLinksByInstituteId(instituteId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: any) => {
          this.applySocialLinksResponse(response.body);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Search error:', error);
          this.toaster?.show('Search failed.', 'error');
        }
      });
  }

  private getSocialLinksByInstituteId(instituteId: number) {
    this.schoolProfileManagementService.getInstituteSocialLinksByInstituteId(instituteId).subscribe({
      next: (response: any) => {
        this.applySocialLinksResponse(response.body);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load social links.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private applySocialLinksResponse(body: any) {
    const data = body?.content ?? body ?? [];
    this.socialLinks = data;
    this.pagination = new Pagination(this.socialLinks, 10);
  }

  editSocialLink(id: number, event: Event): void {
    event.stopPropagation();
    this.socialLinkEdit.emit(id);
  }

  deleteSocialLink(id: number, event: Event): void {
    event.stopPropagation();
    this.pendingDeleteId = id;
    this.isDeletePopupOpen = true;
  }

  confirmDelete(): void {
    if (!this.pendingDeleteId) {
      this.isDeletePopupOpen = false;
      return;
    }

    this.isDeletePopupOpen = false;
    this.isLoading = true;
    const instituteId = this.instituteId;
    this.schoolProfileManagementService.deleteInstituteSocialLink(this.pendingDeleteId, instituteId).subscribe({
      next: () => {
        this.refreshSocialLinks();
        this.toaster?.show('Social link deleted successfully.', 'success');
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Delete Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to delete social link.', 'error');
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
