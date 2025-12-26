import { Component } from '@angular/core';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Router } from '@angular/router';

@Component({
  selector: 'app-designation-listing',
  standalone: true,
  imports: [],
  templateUrl: './designation-listing.component.html',
  styleUrl: './designation-listing.component.css'
})
export class DesignationListingComponent {

  constructor(private router: Router) { }
  ngOnInit(): void {}


  goToCreateDepartments(): void {
    this.router.navigate(ROUTES.DEPARTMENTS.CREATE);
  }
}
