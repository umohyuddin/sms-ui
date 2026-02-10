import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectGroupListingTableComponent } from '../../components/subject-group-listing-table/subject-group-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';

@Component({
  selector: 'app-subject-group-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SubjectGroupListingTableComponent
  ],
  templateUrl: './subject-group-listing.html'
})
export class SubjectGroupListing implements OnInit {
  texts = PageTexts.academic.subjectGroups;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToCreateGroup(): void {
    this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.CREATE);
  }
}
