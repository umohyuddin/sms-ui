import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-dashboard-header-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-header-stats.component.html',
  styleUrl: './dashboard-header-stats.component.css'
})
export class DashboardHeaderStatsComponent {

}


