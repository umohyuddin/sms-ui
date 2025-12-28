import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { SalaryStructureComponentListingTableComponent } from '../../components/salary-structure-component-listing-table/salary-structure-component-listing-table.component';

@Component({
  selector: 'app-salary-structure-component-listing',
  imports: [
    CommonModule,
    FormsModule,
    SalaryStructureComponentListingTableComponent
  ],
  templateUrl: './salary-structure-component-listing.component.html',
  styleUrls: ['./salary-structure-component-listing.component.css'],
  standalone: true,
})
export class SalaryStructureComponentListingComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {}

  goToSalaryStructureComponentCreate(): void {
    // Assuming route exists
    // this.router.navigate(ROUTES.SALARY.SALARY_STRUCTURE_COMPONENT.CREATE);
  }
}
