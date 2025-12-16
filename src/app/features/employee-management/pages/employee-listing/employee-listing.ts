import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StudentListingTableComponent } from '../../components/student-listing-table/student-listing-table.component';


@Component({
  selector: 'app-section-listing',
  imports: [
    CommonModule,
    FormsModule,
    StudentListingTableComponent
],
  templateUrl: './student-listing.html',
  styleUrls: ['./student-listing.css'],
  standalone: true,
})
export class StudentListing implements OnInit {
  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreateStudent(): void {
    this.router.navigate(ROUTES.STUDENT.CREATE);
  }
}


