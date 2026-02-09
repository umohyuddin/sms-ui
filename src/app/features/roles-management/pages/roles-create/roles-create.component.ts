import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { RolesCreateFormComponent } from '../../components/roles-create-form/roles-create-form.component';

@Component({
  selector: 'app-roles-create',
  standalone: true,
  imports: [RolesCreateFormComponent],
  templateUrl: './roles-create.component.html',
  styleUrl: './roles-create.component.css'
})
export class RolesCreateComponent {}
