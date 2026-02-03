import { Component, ViewChild } from '@angular/core';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { InstituteResponse } from '../../models/InstituteResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { InstituteContactCreateFormComponent } from '../institute-contact-create-form/institute-contact-create-form.component';
import { InstituteContactListingTableComponent } from '../institute-contact-listing-table/institute-contact-listing-table.component';

@Component({
  selector: 'app-school-profile-listing-table',
  standalone: true,
  imports: [CommonModule, RouterLink, InstituteContactCreateFormComponent, InstituteContactListingTableComponent],
  templateUrl: './school-profile-listing-table.component.html',
  styleUrl: './school-profile-listing-table.component.css'
})
export class SchoolProfileListingTableComponent {
instituteId?: number;
  selectedContactId?: number;
  @ViewChild(InstituteContactListingTableComponent)
  private contactListingTable?: InstituteContactListingTableComponent;

  texts = PageTexts.SCHOOL_PROFILE;

  createSchool() {
    this.router.navigate(ROUTES.SCHOOL_PROFILE.CREATE); // adjust route
  }

  school?: InstituteResponse;
  constructor(
    private router: Router,
    private schoolProfileManagementService: SchoolProfileManagementService
  ) { }

  ngOnInit(): void {
    this.getProfileDetails();
  }

  goToCampusSetUp(){
    this.router.navigate(ROUTES.CAMPUS.CREATE)
  }

  getProfileDetails(): void {
    this.schoolProfileManagementService.getInstitute().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.school = response.body;
        this.instituteId = this.school?.id;
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

  onContactSaved(): void {
    this.contactListingTable?.reloadContacts();
    this.selectedContactId = undefined;
  }

  onContactEdit(contactId: number): void {
    this.selectedContactId = contactId;
  }
}


