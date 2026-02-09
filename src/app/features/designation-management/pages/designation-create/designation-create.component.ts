import { Component } from '@angular/core';
import { DesignationCreateFormComponent } from '../../components/designation-create-form/designation-create-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-designation-create',
  standalone: true,
  imports: [DesignationCreateFormComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './designation-create.component.html',
  styleUrl: './designation-create.component.css'
})
export class DesignationCreateComponent {

}
