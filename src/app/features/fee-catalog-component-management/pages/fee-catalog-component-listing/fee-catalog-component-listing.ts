import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SectionListingTableComponent } from '../../components/section-listing-table/section-listing-table.component';

@Component({
  selector: 'app-section-listing',
  imports: [
    CommonModule,
    FormsModule,
    SectionListingTableComponent
],
  templateUrl: './section-listing.html',
  styleUrls: ['./section-listing.css'],
  standalone: true,
})
export class SectionListing implements OnInit {
  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreateSection(): void {
    this.router.navigate(ROUTES.CAMPUS.SECTION.CREATE);
  }
}


