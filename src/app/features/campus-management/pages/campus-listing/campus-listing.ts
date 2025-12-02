import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { CampusListingTableComponent } from '../../components/campus-listing-table/campus-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';


@Component({
  selector: 'app-campus-listing',
  imports: [
    CommonModule,
    FormsModule,
    CampusListingTableComponent
  ],
  templateUrl: './campus-listing.html',
  styleUrls: ['./campus-listing.css'],
  standalone: true,
})
export class CampusListing implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {}


  goToCreateCampus(): void {
    this.router.navigate(ROUTES.CAMPUS.CREATE);
  }
}


