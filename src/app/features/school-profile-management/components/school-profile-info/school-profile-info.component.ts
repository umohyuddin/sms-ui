import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-school-profile-info',
  standalone: true,
  imports: [],
  templateUrl: './school-profile-info.component.html',
  styleUrl: './school-profile-info.component.css'
})
export class SchoolProfileInfoComponent {
  constructor(private logger: LoggerService) {}
}
