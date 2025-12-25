import { Component } from '@angular/core';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Router } from '@angular/router';
import { DepartmentListingTableComponent } from '../../components/department-listing-table/department-listing-table.component';

@Component({
  selector: 'app-department-listing',
  standalone: true,
  imports: [DepartmentListingTableComponent],
  templateUrl: './department-listing.component.html',
  styleUrl: './department-listing.component.css'
})
export class DepartmentListingComponent {
constructor(private router: Router) { }

  ngOnInit(): void {}


  goToCreateDepartments(): void {
    this.router.navigate(ROUTES.DEPARTMENTS.CREATE);
  }
}
