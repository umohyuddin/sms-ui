import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard } from '../../models/institute/dashboard.model';
import { DashboardPayload } from '../../models/institute/dashboard-payload.model';
import { DashboardService } from '../../services/institute/dashboard.service';
import { GlobalService } from '../../services/global/global.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit{
  dashboard: Dashboard = new Dashboard();
  dashboardPayload: DashboardPayload = new DashboardPayload();
  constructor(private dashboardService: DashboardService,
              private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.setPayLoad();
    this.loadDashboard();
  }
  ngAfterViewInit(): void {
    // this.createChart();
  }
  setPayLoad(){
    console.log(this.globalService.getInstitute());
    this.dashboardPayload.id = this.globalService.getInstitute().id;
    this.dashboardPayload.category = 'institute';
    this.dashboardPayload.type = 'monthly';
    this.dashboardPayload.year = new Date().getFullYear();
    this.dashboardPayload.month = new Date().getMonth() + 1;
  }
  loadDashboard(){
    console.log(this.dashboardPayload);
    this.dashboardService.getDashBoard(this.dashboardPayload).subscribe({
      next: (res) => {
        this.dashboard = res;
        this.createChart();
      },
      error: (err) =>{
        console.log("Failed to fertch Dasboard data...");
      }
    })
  }

  createChart() {
    // console.log("createChart")
    const expenses = this.dashboard.expenses;
    const revenue = this.dashboard.revenue;

    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Expenses', 'Revenue'],
          datasets: [{
            label: 'Expenses',
            data: [expenses, revenue],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

}
