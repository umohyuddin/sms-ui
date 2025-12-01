import { Component } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TenantCreateFormComponent } from '../../components/tenant-create-form/tenant-create-form.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { Tenant } from '../../models/tenant';

@Component({
  selector: 'app-tenant-create',
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TenantCreateFormComponent,
  ],
  templateUrl: './tenant-create.html',
  styleUrls: ['./tenant-create.css'],
  standalone: true,
})
export class TenantCreate {
   constructor() { }
 
}
