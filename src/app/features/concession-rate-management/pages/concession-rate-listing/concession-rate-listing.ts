import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionRateListingTableComponent } from '../../components/concession-rate-listing-table/concession-rate-listing-table.component';


@Component({
  selector: 'app-concession-rate-listing',
  imports: [
    CommonModule,
    FormsModule,
    ConcessionRateListingTableComponent
  ],
  templateUrl: './concession-rate-listing.html',
  styleUrls: ['./concession-rate-listing.css'],
  standalone: true,
})
export class ConcessionRateListing implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {}

  goToConcessionRate(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.CREATE);
  }
}
