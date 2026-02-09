import { Component } from '@angular/core';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { EmployeeTypeInfoComponent } from '../../components/employee-type-info/employee-type-info.component';

@Component({
  selector: 'app-employee-type-details',
  standalone: true,
  imports: [EmployeeTypeInfoComponent],
  templateUrl: './employee-type-details.component.html',
  styleUrl: './employee-type-details.component.css'
})
export class EmployeeTypeDetailsComponent {
 routedId: number | null = null;
  
    constructor(private route: ActivatedRoute,
      private router: Router
    , private logger: LoggerService) { }
  
    ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.routedId = id ? +id : null; // convert string to number
        console.log('Resource ID from URL:', this.routedId);
      });
    }
    goToUpdatePage() {
      if (this.routedId) {
        this.router.navigate(ROUTES.EMPLOYEE_TYPE.EDIT(this.routedId.toString()));
      } else {
        console.log('Resource ID from URL Not Found:');
      }
    }
}
