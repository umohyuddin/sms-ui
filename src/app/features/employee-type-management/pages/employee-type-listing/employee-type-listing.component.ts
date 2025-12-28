import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { EmployeeTypeCreateFormComponent } from '../../components/employee-type-create-form/employee-type-create-form.component';
import { EmployeeTypeListingTableComponent } from '../../components/employee-type-listing-table/employee-type-listing-table.component';

@Component({
  selector: 'app-employee-type-listing',
  standalone: true,
  imports: [EmployeeTypeListingTableComponent],
  templateUrl: './employee-type-listing.component.html',
  styleUrl: './employee-type-listing.component.css'
})
export class EmployeeTypeListingComponent {
constructor(private router: Router) { }

  ngOnInit(): void {}


  goToFeeCatalog(): void {
    this.router.navigate(ROUTES.EMPLOYEE_TYPE.CREATE);
  }
}
