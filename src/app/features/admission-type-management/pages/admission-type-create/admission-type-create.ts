import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionTypeCreateFormComponent } from '../../components/admission-type-create-form/admission-type-create-form.component';

@Component({
  selector: 'app-admission-type-create',
  standalone: true,
  imports: [CommonModule, RouterModule, AdmissionTypeCreateFormComponent],
  templateUrl: './admission-type-create.html',
})
export class AdmissionTypeCreate {
}
