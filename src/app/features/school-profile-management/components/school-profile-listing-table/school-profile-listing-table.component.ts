import { Component } from '@angular/core';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { InstituteResponse } from '../../models/InstituteResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-school-profile-listing-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './school-profile-listing-table.component.html',
  styleUrl: './school-profile-listing-table.component.css'
})
export class SchoolProfileListingTableComponent {


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
}


