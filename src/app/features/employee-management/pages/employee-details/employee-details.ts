import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { EmployeeInfoComponent } from '../../components/employee-info/employee-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';


@Component({
  selector: 'app-student-details',
  imports: [
    EmployeeInfoComponent
  ],
  templateUrl: './employee-details.html',
  styleUrls: ['./employee-details.css'],
  standalone: true,
})
export class EmployeeDetails {
  routedId: number | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.routedId = id ? +id : null; // convert string to number
      console.log('Resource ID from URL:', this.routedId);
    });
  }
  goToUpdatePage() {
    if (this.routedId) {
      this.router.navigate(ROUTES.EMPLOYEE.EDIT(this.routedId.toString()));
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}


