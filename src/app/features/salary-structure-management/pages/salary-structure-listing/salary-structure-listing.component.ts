import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SalaryStructureListingTableComponent } from '../../components/salary-structure-listing-table/salary-structure-listing-table.component';

@Component({
  selector: 'app-salary-structure-listing',
  standalone: true,
  imports: [SalaryStructureListingTableComponent],
  templateUrl: './salary-structure-listing.component.html',
  styleUrl: './salary-structure-listing.component.css'
})
export class SalaryStructureListingComponent {
  constructor(private router: Router) { }

  ngOnInit(): void { }


  goToCreateFeeRate(): void {
    this.router.navigate(ROUTES.SALARY_STRUCTURE.CREATE);
  }
}
