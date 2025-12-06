import { Component } from '@angular/core';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusInfoComponent } from '../../components/campus-info/campus-info.component';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { CampusResponse } from '../../models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
@Component({
  selector: 'app-Campus-details',
  imports: [CampusInfoComponent],
  templateUrl: './campus-details.html',
  styleUrls: ['./campus-details.css'],
  standalone: true,
})
export class CampusDetails {
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
      this.router.navigate(ROUTES.CAMPUS.EDIT(this.routedId.toString()));
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}

