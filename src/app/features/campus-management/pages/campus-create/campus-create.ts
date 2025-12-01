import { Component } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { CampusCreateFormComponent } from '../../components/campus-create-form/campus-create-form.component';

@Component({
  selector: 'app-campus-create',
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CampusCreateFormComponent,
  ],
  templateUrl: './Campus-create.html',
  styleUrls: ['./Campus-create.css'],
  standalone: true,
})
export class CampusCreate {
   constructor() { }
 
}
