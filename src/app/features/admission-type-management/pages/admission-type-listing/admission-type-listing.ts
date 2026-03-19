import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionTypeListingTableComponent } from '../../components/admission-type-listing-table/admission-type-listing-table.component';

@Component({
  selector: 'app-admission-type-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, AdmissionTypeListingTableComponent],
  templateUrl: './admission-type-listing.html',
})
export class AdmissionTypeListing {
}
