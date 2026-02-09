import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { SalaryStructureComponentListingTableComponent } from '../../components/salary-structure-component-listing-table/salary-structure-component-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

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
  constructor(private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {}

  goToSalaryStructureComponentCreate(): void {
    // Assuming route exists
    this.router.navigate(ROUTES.SALARY_STRUCTURE_COMPONENT.CREATE);
  }
}
