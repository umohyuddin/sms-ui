import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogComponentListingTableComponent } from '../../components/fee-catalog-component-listing-table/fee-catalog-component-listing-table.component';


@Component({
  selector: 'app-fee-catalog-component-listing',
  imports: [
    CommonModule,
    FormsModule,
    FeeCatalogComponentListingTableComponent
],
  templateUrl: './fee-catalog-component-listing.html',
  styleUrls: ['./fee-catalog-component-listing.css'],
  standalone: true,
})
export class FeeCatalogComponentListing implements OnInit {
  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreateFeeCatalogComponent(): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG_COMPONENT.CREATE);
  }
}


