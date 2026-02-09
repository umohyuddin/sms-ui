import { Component } from '@angular/core';
import { TenantInfoComponent } from '../../components/tenant-info/tenant-info.component';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
@Component({
  selector: 'app-tenant-details',
  imports: [TenantInfoComponent, LoaderComponent],
  templateUrl: './tenant-details.html',
  styleUrls: ['./tenant-details.css'],
  standalone: true,
})
export class TenantDetails {
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
       this.router.navigate(ROUTES.ACADEMIC_YEAR.EDIT(this.routedId.toString()));
     } else {
       this.logger.warn('Resource ID from URL Not Found');
     }
   }
}


