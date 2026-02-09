import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentManagementService } from '../../services/student-management.service';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentInfoComponent } from '../../components/student-info/student-info.component';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';


@Component({
  selector: 'app-student-details',
  imports: [
    StudentInfoComponent
  ],
  templateUrl: './student-details.html',
  styleUrls: ['./student-details.css'],
  standalone: true,
})
export class StudentDetails {
    routedId: number | null = null;
  
    constructor(private route: ActivatedRoute,
      private router: Router,
      private logger: LoggerService
    ) { }
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.routedId = id ? +id : null; // convert string to number
        this.logger.info('Resource ID from URL', this.routedId);
      });
    }
    goToUpdatePage() {
      if (this.routedId) {
        this.router.navigate(ROUTES.STUDENT.EDIT(this.routedId.toString()));
      } else {
        this.logger.warn('Resource ID from URL Not Found');
      }
    }
}


