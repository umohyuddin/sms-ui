import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { FeeRateInfoComponent } from '../../components/fee-rate-info/fee-rate-info.component';
import { FeeRateManagementService } from '../../services/fee-rate-management.service';
import { FeeRateResponse } from '../../models/FeeRateResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';



@Component({
  selector: 'app-rate-details',
  imports: [FeeRateInfoComponent
  ],
  templateUrl: './fee-rate-details.html',
  styleUrls: ['./fee-rate-details.css'],
  standalone: true,
})
export class FeeRateDetails {
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


