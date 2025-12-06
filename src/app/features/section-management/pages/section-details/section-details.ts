import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionInfoComponent } from '../../components/section-info/section-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';


@Component({
  selector: 'app-section-details',
  imports: [SectionInfoComponent
  ],
  templateUrl: './section-details.html',
  styleUrls: ['./section-details.css'],
  standalone: true,
})
export class SectionDetails {
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
        this.router.navigate(ROUTES.CAMPUS.SECTION.EDIT(this.routedId.toString()));
      } else {
        console.log('Resource ID from URL Not Found:');
      }
    }
}


