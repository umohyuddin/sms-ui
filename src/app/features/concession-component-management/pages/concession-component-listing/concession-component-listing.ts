import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionListingTableComponent } from '../../components/concession-component-listing-table/concession-component-listing-table.component';


@Component({
  selector: 'app-concession-component-listing',
  imports: [
    CommonModule,
    FormsModule,
    ConcessionListingTableComponent
  ],
  templateUrl: './concession-component-listing.html',
  styleUrls: ['./concession-component-listing.css'],
  standalone: true,
})
export class ConcessionListing implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {}

  goToConcessionComponent(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.CREATE);
  }
}
