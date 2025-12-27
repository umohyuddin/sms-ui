import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-type-listing',
  standalone: true,
  imports: [],
  templateUrl: './employee-type-listing.component.html',
  styleUrl: './employee-type-listing.component.css'
})
export class EmployeeTypeListingComponent {
constructor(private router: Router) { }

  ngOnInit(): void {}


  goToFeeCatalog(): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.CREATE);
  }
}
