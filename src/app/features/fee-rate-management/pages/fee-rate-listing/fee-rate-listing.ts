import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeRateListingTableComponent } from '../../components/fee-rate-listing-table/fee-rate-listing-table.component';


@Component({
  selector: 'app-fee-catalog-component-listing',
  imports: [
    CommonModule,
    FormsModule,
    FeeRateListingTableComponent
],
  templateUrl: './fee-rate-listing.html',
  styleUrls: ['./fee-rate-listing.css'],
  standalone: true,
})
export class FeeRateListing implements OnInit {
  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreateFeeRate(): void {
    this.router.navigate(ROUTES.FEE.FEE_RATE.CREATE);
  }
}


