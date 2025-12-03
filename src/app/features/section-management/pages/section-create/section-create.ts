import { Component } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StandardCreateFormComponent } from '../../components/standard-create-form/standard-create-form.component';



@Component({
  selector: 'app-standard-create',
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    StandardCreateFormComponent,
  ],
  templateUrl: './standard-create.html',
  styleUrls: ['./standard-create.css'],
  standalone: true,
})
export class StandardCreate {
   constructor() { }
 
}
