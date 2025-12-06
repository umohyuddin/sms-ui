import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StandardInfoComponent } from '../../components/standard-info/standard-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-standard-details',
  imports: [StandardInfoComponent],
  templateUrl: './standard-details.html',
  styleUrls: ['./standard-details.css'],
  standalone: true,
})
export class StandardDetails {
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
      this.router.navigate(ROUTES.CAMPUS.STANDARD.EDIT(this.routedId.toString()));
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}


