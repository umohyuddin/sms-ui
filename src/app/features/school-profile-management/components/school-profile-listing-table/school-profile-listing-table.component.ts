import { Component, ViewChild } from '@angular/core';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { InstituteResponse } from '../../models/InstituteResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { InstituteContactCreateFormComponent } from '../institute-contact-create-form/institute-contact-create-form.component';
import { InstituteContactListingTableComponent } from '../institute-contact-listing-table/institute-contact-listing-table.component';
import { InstituteSocialLinkCreateFormComponent } from '../institute-social-link-create-form/institute-social-link-create-form.component';
import { InstituteSocialLinkListingTableComponent } from '../institute-social-link-listing-table/institute-social-link-listing-table.component';
import { InstituteBoardMemberCreateFormComponent } from '../institute-board-member-create-form/institute-board-member-create-form.component';
import { InstituteBoardMemberListingTableComponent } from '../institute-board-member-listing-table/institute-board-member-listing-table.component';
import { InstituteDocumentComponent } from '../institute-document/institute-document.component';
import { InstituteAccreditationCreateFormComponent } from '../institute-accreditation-create-form/institute-accreditation-create-form.component';
import { InstituteAccreditationListingTableComponent } from '../institute-accreditation-listing-table/institute-accreditation-listing-table.component';
import { InstituteFinancialSettingsFormComponent } from '../institute-financial-settings-form/institute-financial-settings-form.component';
import { InstituteFacilityCreateFormComponent } from '../institute-facility-create-form/institute-facility-create-form.component';
import { InstituteFacilityListingTableComponent } from '../institute-facility-listing-table/institute-facility-listing-table.component';

@Component({
  selector: 'app-school-profile-listing-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InstituteContactCreateFormComponent,
    InstituteContactListingTableComponent,
    InstituteSocialLinkCreateFormComponent,
    InstituteSocialLinkListingTableComponent,
    InstituteBoardMemberCreateFormComponent,
    InstituteBoardMemberListingTableComponent,
    InstituteDocumentComponent,
    InstituteAccreditationCreateFormComponent,
    InstituteAccreditationListingTableComponent,
    InstituteFinancialSettingsFormComponent,
    InstituteFacilityCreateFormComponent,
    InstituteFacilityListingTableComponent
  ],
  templateUrl: './school-profile-listing-table.component.html',
  styleUrl: './school-profile-listing-table.component.css'
})
export class SchoolProfileListingTableComponent {
  instituteId?: number;
  selectedContactId?: number;
  selectedSocialLinkId?: number;
  selectedBoardMemberId?: number;
  @ViewChild(InstituteContactListingTableComponent)
  private contactListingTable?: InstituteContactListingTableComponent;
  @ViewChild(InstituteSocialLinkListingTableComponent)
  private socialLinkListingTable?: InstituteSocialLinkListingTableComponent;
  @ViewChild(InstituteBoardMemberListingTableComponent)
  private boardMemberListingTable?: InstituteBoardMemberListingTableComponent;
  @ViewChild(InstituteAccreditationListingTableComponent)
  private accreditationListingTable?: InstituteAccreditationListingTableComponent;
  @ViewChild(InstituteFacilityListingTableComponent)
  private facilityListingTable?: InstituteFacilityListingTableComponent;

  selectedAccreditationId?: number;

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

  goToCampusSetUp() {
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

  onSocialLinkSaved(): void {
    this.socialLinkListingTable?.reloadSocialLinks();
    this.selectedSocialLinkId = undefined;
  }

  onBoardMemberSaved(): void {
    this.boardMemberListingTable?.reloadBoardMembers();
    this.selectedBoardMemberId = undefined;
  }

  onAccreditationSaved(): void {
    this.accreditationListingTable?.refreshAccreditations();
    this.selectedAccreditationId = undefined;
  }

  onContactEdit(contactId: number): void {
    this.selectedContactId = contactId;
  }

  onSocialLinkEdit(linkId: number): void {
    this.selectedSocialLinkId = linkId;
  }

  onBoardMemberEdit(memberId: number): void {
    this.selectedBoardMemberId = memberId;
  }

  onAccreditationEdit(accreditationId: number): void {
    this.selectedAccreditationId = accreditationId;
  }

  onFacilitySaved(): void {
    this.facilityListingTable?.reloadFacilities();
  }
}


