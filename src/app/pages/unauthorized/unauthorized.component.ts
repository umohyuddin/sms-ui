import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-unauthorized',
  imports: [FormsModule, CommonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent implements AfterViewInit {
  constructor(private router: Router){}
  ngAfterViewInit(): void {
    const ctx = document.getElementById('unauthChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Access Denied', ''],
        datasets: [
          {
            data: [75, 25],
            backgroundColor: ['#dc3545', '#e9ecef'],
            borderWidth: 0
          }
        ]
      },
      options: {
        // ✅ Move cutout here, not inside datasets
        cutout: '70%',              // thickness of the ring
        rotation: -90,              // start angle
        circumference: 180,         // half-circle
        plugins: { legend: { display: false } },
        animation: {
          animateRotate: true,
          duration: 1500
        }
      }
    });
  }
  goHome(){
    this.router.navigate(['/dashboard']);
  }

}
