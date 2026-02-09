import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { SchoolProfileCreateFormComponent } from '../../components/school-profile-create-form/school-profile-create-form.component';

@Component({
  selector: 'app-school-profile-create',
  standalone: true,
  imports: [SchoolProfileCreateFormComponent],
  templateUrl: './school-profile-create.component.html',
  styleUrl: './school-profile-create.component.css'
})
export class SchoolProfileCreateComponent {

}
