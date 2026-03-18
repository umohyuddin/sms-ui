import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionListingTableComponent } from '../../components/concession-listing-table/concession-listing-table.component';


@Component({
  selector: 'app-concession-listing',
  imports: [
    CommonModule,
    FormsModule,
    ConcessionListingTableComponent
  ],
  templateUrl: './concession-listing.html',
  styleUrls: ['./concession-listing.css'],
  standalone: true,
})
export class ConcessionListing implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {}

  goToConcession(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.CREATE);
  }
}
