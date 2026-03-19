import { ViewChild, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogListingTableComponent } from '../../components/fee-catalog-listing-table/fee-catalog-listing-table.component';


@Component({
  selector: 'app-fee-catalog-listing',
  imports: [
    CommonModule,
    FormsModule,
    FeeCatalogListingTableComponent
  ],
  templateUrl: './fee-catalog-listing.html',
  styleUrls: ['./fee-catalog-listing.css'],
  standalone: true,
})
export class FeeCatalogListing implements OnInit {
  @ViewChild(FeeCatalogListingTableComponent) listingTable!: FeeCatalogListingTableComponent;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToFeeCatalog(): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.CREATE);
  }

  openEditModal(item: any): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.EDIT(item.id.toString()));
  }

  onSaveSuccess(): void {
    this.listingTable.getFeeCatalogs();
  }
}


