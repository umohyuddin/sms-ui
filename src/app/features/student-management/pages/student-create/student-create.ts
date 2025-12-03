import { Component } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SectionCreateFormComponent } from '../../components/section-create-form/section-create-form.component';




@Component({
  selector: 'app-standard-create',
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SectionCreateFormComponent
  ],
  templateUrl: './section-create.html',
  styleUrls: ['./section-create.css'],
  standalone: true,
})
export class SectionCreate {
   constructor() { }
 
}
