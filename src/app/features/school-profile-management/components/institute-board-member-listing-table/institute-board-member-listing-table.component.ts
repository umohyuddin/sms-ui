import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { InstituteBoardMemberResponse } from '../../models/InstituteBoardMemberResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-institute-board-member-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent, DeletePopupComponent],
  templateUrl: './institute-board-member-listing-table.component.html',
  styleUrl: './institute-board-member-listing-table.component.css'
})
export class InstituteBoardMemberListingTableComponent implements OnChanges {
  @Input() instituteId?: number;
  @Input() organizationId?: number;
  @Output() boardMemberEdit = new EventEmitter<number>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  pagination: Pagination<InstituteBoardMemberResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  boardMembers: InstituteBoardMemberResponse[] = [];
  isLoading = false;

  isDeletePopupOpen = false;
  pendingDeleteId?: number;

  private destroy$ = new Subject<void>();

  constructor(private schoolProfileManagementService: SchoolProfileManagementService, private logger: LoggerService) {}

  columns = [
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'roleId', label: 'Role', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'contactNumber', label: 'Contact Number', sortable: false },
    { key: 'termStart', label: 'Term Start', sortable: true },
    { key: 'termEnd', label: 'Term End', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.refreshBoardMembers();
    this.subscribeToSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituteId']) {
      this.refreshBoardMembers();
    }
  }

  private refreshBoardMembers() {
    this.isLoading = true;
    if (this.instituteId) {
      this.getBoardMembersByInstituteId(this.instituteId);
    } else {
      this.schoolProfileManagementService.getInstituteBoardMembers().subscribe({
        next: (response) => {
          this.applyBoardMembersResponse(response.body);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
          this.toaster?.show('Failed to load board members.', 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  reloadBoardMembers(): void {
    this.refreshBoardMembers();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          const keyword = search || '';
          this.isLoading = true;
          if (keyword) {
            return this.schoolProfileManagementService.searchInstituteBoardMembers(keyword);
          }
          if (this.instituteId) {
            return this.schoolProfileManagementService.getInstituteBoardMembersByInstituteId(this.instituteId);
          }
          return this.schoolProfileManagementService.getInstituteBoardMembers();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.applyBoardMembersResponse(response.body);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Search error:', error);
          this.toaster?.show('Search failed.', 'error');
        }
      });
  }

  private getBoardMembersByInstituteId(instituteId: number) {
    this.schoolProfileManagementService.getInstituteBoardMembersByInstituteId(instituteId).subscribe({
      next: (response) => {
        this.applyBoardMembersResponse(response.body);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load board members.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private applyBoardMembersResponse(body: any) {
    const data = body?.content ?? body ?? [];
    this.boardMembers = data;
    this.pagination = new Pagination(this.boardMembers, 10);
  }

  editBoardMember(id: number, event: Event): void {
    event.stopPropagation();
    this.boardMemberEdit.emit(id);
  }

  deleteBoardMember(id: number, event: Event): void {
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
    const orgId = this.organizationId ?? this.instituteId;
    this.schoolProfileManagementService.deleteInstituteBoardMember(this.pendingDeleteId, orgId).subscribe({
      next: () => {
        this.refreshBoardMembers();
        this.toaster?.show('Board member deleted successfully.', 'success');
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Delete Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to delete board member.', 'error');
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
