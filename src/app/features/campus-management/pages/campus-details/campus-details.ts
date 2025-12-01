import { Component } from '@angular/core';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusInfoComponent } from '../../components/campus-info/campus-info.component';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { CampusResponse } from '../../models/campusResponse';
@Component({
  selector: 'app-Campus-details',
  imports: [CampusInfoComponent],
  templateUrl: './campus-details.html',
  styleUrls: ['./campus-details.css'],
  standalone: true,
})
export class CampusDetails {
  constructor() { }

  ngOnInit(): void {
  }

}


