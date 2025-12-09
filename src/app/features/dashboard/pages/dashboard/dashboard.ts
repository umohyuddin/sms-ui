import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  constructor(private router: Router) { }

  goToNewAddmission() {
    this.router.navigate(ROUTES.STUDENT.CREATE);
  }

}
