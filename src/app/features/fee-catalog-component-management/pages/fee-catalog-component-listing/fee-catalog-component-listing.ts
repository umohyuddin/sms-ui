import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogComponentListingTableComponent } from '../../components/fee-catalog-component-listing-table/fee-catalog-component-listing-table.component';
import { FeeCatalogComponentCreateFormComponent } from '../../components/fee-catalog-component-create-form/fee-catalog-component-create-form.component';


@Component({
  selector: 'app-fee-catalog-component-listing',
  imports: [
    CommonModule,
    FormsModule,
    FeeCatalogComponentListingTableComponent,
    FeeCatalogComponentCreateFormComponent
  ],
  templateUrl: './fee-catalog-component-listing.html',
  styleUrls: ['./fee-catalog-component-listing.css'],
  standalone: true,
})
export class FeeCatalogComponentListing implements OnInit {
  @ViewChild('feeCatalogComponentModal') feeCatalogComponentModal!: FeeCatalogComponentCreateFormComponent;
  @ViewChild(FeeCatalogComponentListingTableComponent) listingTable!: FeeCatalogComponentListingTableComponent;

  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToCreateFeeCatalogComponent(): void {
    this.feeCatalogComponentModal.show();
  }

  openEditModal(item: any): void {
    this.feeCatalogComponentModal.show(item.id);
  }

  onSaveSuccess(): void {
    this.listingTable.getFeeCatalogComponents();
  }
}


