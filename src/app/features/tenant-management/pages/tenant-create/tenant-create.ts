import { Component } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TenantCreateFormComponent } from '../../components/tenant-create-form/tenant-create-form.component';

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
