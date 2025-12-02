import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { StandardListingTableComponent } from '../../components/standard-listing-table/standard-listing-table.component';

@Component({
  selector: 'app-standard-listing',
  imports: [
    CommonModule,
    FormsModule,
    StandardListingTableComponent
],
  templateUrl: './standard-listing.html',
  styleUrls: ['./standard-listing.css'],
  standalone: true,
})
export class StandardListing implements OnInit {
  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreatestandard(): void {
    this.router.navigate(['/standardes/standard-create']);
  }
}


