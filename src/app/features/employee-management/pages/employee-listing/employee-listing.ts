import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { EmployeeListingTableComponent } from '../../components/employee-listing-table/employee-listing-table.component';


@Component({
  selector: 'app-section-listing',
  imports: [
    CommonModule,
    FormsModule,
    EmployeeListingTableComponent
],
  templateUrl: './employee-listing.html',
  styleUrls: ['./employee-listing.css'],
  standalone: true,
})
export class EmployeeListing implements OnInit {
  URL = '';
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreate(): void {
    this.router.navigate(ROUTES.EMPLOYEE.CREATE);
  }
}


