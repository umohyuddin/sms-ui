import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { Standard } from '../../models/standard';


@Component({
  selector: 'app-standard-info',
  standalone: true,
  imports: [CommonModule,MatExpansionModule],
  templateUrl: './standard-info.component.html',
  styleUrls: ['./standard-info.component.css']
})
export class StandardInfoComponent {
 @Input() standardData: Standard | undefined;
}
