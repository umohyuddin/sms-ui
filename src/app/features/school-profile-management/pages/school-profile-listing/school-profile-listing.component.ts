import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { SchoolProfileListingTableComponent } from '../../components/school-profile-listing-table/school-profile-listing-table.component';

@Component({
  selector: 'app-school-profile-listing',
  standalone: true,
  imports: [CommonModule,SchoolProfileListingTableComponent],
  templateUrl: './school-profile-listing.component.html',
  styleUrl: './school-profile-listing.component.css'
})
export class SchoolProfileListingComponent {
school: any = null; // initially null
 texts = PageTexts.SCHOOL_PROFILE;
constructor(private router: Router) {}

createSchool() {
  this.router.navigate(ROUTES.SCHOOL_PROFILE.CREATE); // adjust route
}
}
