import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionTypeInfoComponent } from '../../components/admission-type-info/admission-type-info.component';

@Component({
  selector: 'app-admission-type-details',
  standalone: true,
  imports: [CommonModule, RouterModule, AdmissionTypeInfoComponent],
  templateUrl: './admission-type-details.html',
})
export class AdmissionTypeDetails {
}
