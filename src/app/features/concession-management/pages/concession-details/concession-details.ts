import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionInfoComponent } from '../../components/concession-info/concession-info.component';
@Component({
  selector: 'app-concession-details',
  imports: [ConcessionInfoComponent],
  templateUrl: './concession-details.html',
  styleUrls: ['./concession-details.css'],
  standalone: true,
})
export class ConcessionDetails {
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
        this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.EDIT(this.routedId.toString()));
      } else {
        console.log('Resource ID from URL Not Found:');
      }
    }
}


