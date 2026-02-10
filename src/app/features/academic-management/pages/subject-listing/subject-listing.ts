import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectListingTableComponent } from '../../components/subject-listing-table/subject-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';

@Component({
  selector: 'app-subject-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SubjectListingTableComponent
  ],
  templateUrl: './subject-listing.html',
  styleUrls: ['./subject-listing.css']
})
export class SubjectListing implements OnInit {
  texts = PageTexts.academic.subjects;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToCreateSubject(): void {
    this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.CREATE);
  }
}
