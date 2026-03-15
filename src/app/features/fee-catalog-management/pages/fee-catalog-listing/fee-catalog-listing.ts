import { ViewChild, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogListingTableComponent } from '../../components/fee-catalog-listing-table/fee-catalog-listing-table.component';
import { FeeCatalogCreateFormComponent } from '../../components/fee-catalog-create-form/fee-catalog-create-form.component';


@Component({
  selector: 'app-fee-catalog-listing',
  imports: [
    CommonModule,
    FormsModule,
    FeeCatalogListingTableComponent,
    FeeCatalogCreateFormComponent
  ],
  templateUrl: './fee-catalog-listing.html',
  styleUrls: ['./fee-catalog-listing.css'],
  standalone: true,
})
export class FeeCatalogListing implements OnInit {
  @ViewChild('feeCatalogModal') feeCatalogModal!: FeeCatalogCreateFormComponent;
  @ViewChild(FeeCatalogListingTableComponent) listingTable!: FeeCatalogListingTableComponent;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToFeeCatalog(): void {
    this.feeCatalogModal.show();
  }

  openEditModal(item: any): void {
    this.feeCatalogModal.show(item.id);
  }

  onSaveSuccess(): void {
    this.listingTable.getFeeCatalogs();
  }
}


