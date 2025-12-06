import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogInfoComponent } from '../../components/fee-catalog-info/fee-catalog-info.component';
@Component({
  selector: 'app-fee-catalog-details',
  imports: [FeeCatalogInfoComponent],
  templateUrl: './fee-catalog-details.html',
  styleUrls: ['./fee-catalog-details.css'],
  standalone: true,
})
export class FeeCatalogDetails {
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
        this.router.navigate(ROUTES.FEE.FEE_CATALOG.EDIT(this.routedId.toString()));
      } else {
        console.log('Resource ID from URL Not Found:');
      }
    }
}


