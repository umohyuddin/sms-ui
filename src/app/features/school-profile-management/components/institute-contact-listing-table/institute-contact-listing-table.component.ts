import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { InstituteContactResponse } from '../../models/InstituteContactResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-institute-contact-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './institute-contact-listing-table.component.html',
  styleUrl: './institute-contact-listing-table.component.css'
})
export class InstituteContactListingTableComponent implements OnChanges {
  @Input() instituteId?: number;
  @Input() organizationId?: number;
  @Output() contactEdit = new EventEmitter<number>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  pagination: Pagination<InstituteContactResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  contacts: InstituteContactResponse[] = [];
  //instituteId: number | null = null;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(private schoolProfileManagementService: SchoolProfileManagementService) {}

  columns = [
    { key: 'contactPersonName', label: 'Contact Person', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.refreshContacts();
    this.subscribeToSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituteId']) {
      this.refreshContacts();
    }
  }

  private refreshContacts() {
    this.isLoading = true;
    if (this.instituteId) {
      this.getContactsByInstituteId(this.instituteId);
    } else {
      this.schoolProfileManagementService.getInstituteContacts().subscribe({
        next: (response) => {
          this.applyContactsResponse(response.body);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
          this.toaster?.show('Failed to load contacts.', 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  reloadContacts(): void {
    this.refreshContacts();
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
            return this.schoolProfileManagementService.searchInstituteContacts(keyword);
          }
          if (this.instituteId) {
            return this.schoolProfileManagementService.getInstituteContactsByInstituteId(this.instituteId);
          }
          return this.schoolProfileManagementService.getInstituteContacts();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.applyContactsResponse(response.body);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Search error:', error);
          this.toaster?.show('Search failed.', 'error');
        }
      });
  }

  private getContactsByInstituteId(instituteId: number) {
    this.schoolProfileManagementService.getInstituteContactsByInstituteId(instituteId).subscribe({
      next: (response) => {
        this.applyContactsResponse(response.body);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load contacts.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private applyContactsResponse(body: any) {
    const data = body?.content ?? body ?? [];
    this.contacts = data;
    this.pagination = new Pagination(this.contacts, 10);
  }

  deleteContact(contactId: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this contact?')) {
      this.isLoading = true;
      const orgId = this.organizationId ?? this.instituteId;
      this.schoolProfileManagementService.deleteInstituteContact(contactId, orgId).subscribe({
        next: () => {
          this.refreshContacts();
          this.toaster?.show('Contact deleted successfully.', 'success');
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
          this.toaster?.show('Failed to delete contact.', 'error');
        }
      });
    }
  }

  editContact(contactId: number, event: Event): void {
    event.stopPropagation();
    this.contactEdit.emit(contactId);
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
