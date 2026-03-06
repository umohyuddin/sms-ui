import { Component, ViewChild } from '@angular/core';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { InstituteResponse } from '../../models/InstituteResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';
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
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

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
    InstituteFacilityListingTableComponent,
    LoaderComponent,
    ToasterComponent
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
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  selectedAccreditationId?: number;
  isLoading = false;
  loadingMessage = '';

  texts = PageTexts.SCHOOL_PROFILE;

  createSchool() {
    this.router.navigate(ROUTES.SCHOOL_PROFILE.CREATE); // adjust route
  }

  school?: InstituteResponse;
  constructor(
    private router: Router,
    private schoolProfileManagementService: SchoolProfileManagementService
    , private logger: LoggerService) { }

  ngOnInit(): void {
    this.getProfileDetails();
  }

  goToCampusSetUp() {
    this.router.navigate(ROUTES.CAMPUS.CREATE)
  }

  getProfileDetails(): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading Profile Details...';
    this.schoolProfileManagementService.getInstitute().subscribe({
      next: (response) => {
        this.school = response.body;
        this.instituteId = this.school?.id;
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Request Error Status:', error.status);
        this.toaster?.show('Failed to load profile details.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
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
