import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StudentListingTableComponent } from '../../components/student-listing-table/student-listing-table.component';
import { StudentManagementService } from '../../services/student-management.service';
import { FeeRateResponse } from '../../../fee-rate-management/models/FeeRateResponse';
import { ActiveFeeRateResponse, FeeComponent } from '../../models/ActiveFeeRateFormatedResponse';


@Component({
  selector: 'app-fee-calculator-listing',
  imports: [
    CommonModule,
    FormsModule,
    StudentListingTableComponent
  ],
  templateUrl: './student-fee-calculator.html',
  styleUrls: ['./student-fee-calculator.css'],
  standalone: true,
})
export class StudentFeeCaculator implements OnInit {

  activeFeeRate: FeeRateResponse[] = []
  activeFeeRate_: ActiveFeeRateResponse[] = []
  selectedComponents: { [feeId: number]: FeeComponent[] } = {}; // store selected components grouped by fee catalog
  constructor(private studentManagementSerivce: StudentManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }


  widgetClasses = [
    'kt-widget2__item--primary',
    'kt-widget2__item--success',
    'kt-widget2__item--warning',
    'kt-widget2__item--danger',
    'kt-widget2__item--brand',
    'kt-widget2__item--info'
  ];

  getRandomClass(): string {
    const index = Math.floor(Math.random() * this.widgetClasses.length);
    return this.widgetClasses[index];
  }

  getAmount(comp: any): string {
    const rate = comp.rates?.[0]; // take first rate
    return rate ? `${rate.amount} ${rate.currency}` : '';
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {


      const apiParams = {
        studentId: params['studentId'],
        academicYearId: params['academicYearId'],
        campusId: params['campusId'],
        standardId: params['standardId']
      };

      console.log("Query Params Object:", apiParams);
      this.studentManagementSerivce.getActiveFeeRates(apiParams).subscribe({
        next: (response) => {
          console.log('✅ Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.activatedRoute = response.body;
          this.activeFeeRate = response.body;
          const data: FeeRateResponse[] = response.body;

          // Group by feeCatalog id
          const catalogs = Array.from(new Set(data.map(d => d.feeComponent.feeCatalog.id)))
            .map(catalogId => {
              const catalogRates = data.filter(d => d.feeComponent.feeCatalog.id === catalogId);
              const catalogName = catalogRates[0].feeComponent.feeCatalog.name;

              // Group by component
              const components = Array.from(new Set(catalogRates.map(d => d.feeComponent.id)))
                .map(compId => {
                  return {
                    id: compId,
                    name: catalogRates.find(d => d.feeComponent.id === compId)?.feeComponent.componentName,
                    rates: catalogRates.filter(d => d.feeComponent.id === compId)
                  }
                });

              return { id: catalogId, name: catalogName, components };
            });

          this.activeFeeRate_ = catalogs;
          this.activeFeeRate_.forEach(fee => {
            fee.components.forEach(comp => {
              // Assign a random class only once
              comp.randomClass = this.widgetClasses[Math.floor(Math.random() * this.widgetClasses.length)];
            });
          })
          console.log('Grouped Fee Rates:', this.activeFeeRate_);

        },
        error: (error) => {
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Request Complete');
        }
      })
    });

    ;
  }


  toggleSelection(fee: ActiveFeeRateResponse, comp: FeeComponent, event: any) {
    if (!this.selectedComponents[fee.id]) this.selectedComponents[fee.id] = [];

    if (event.target.checked) {
      this.selectedComponents[fee.id].push(comp);
    } else {
      this.selectedComponents[fee.id] = this.selectedComponents[fee.id].filter(c => c.id !== comp.id);
      if (this.selectedComponents[fee.id].length === 0) delete this.selectedComponents[fee.id];
    }
  }

  getSelectedFeeCatalogs(): ActiveFeeRateResponse[] {
    // return only fee catalogs that have selected components
    return this.activeFeeRate_.filter(fee => this.selectedComponents[fee.id]?.length);
  }
  goToCreateStudent(): void {
    this.router.navigate(ROUTES.STUDENT.CREATE);
  }

  // Return color class based on fee type
  getFeeHeadingClass(fee: ActiveFeeRateResponse) {
    switch (fee.name) { // 'ADMISSION', 'TUITION', 'TRANSPORT'
      case 'ADMISSION': return 'kt-font-info';
      case 'TUITION': return 'kt-font-success';
      case 'TRANSPORT': return 'kt-font-danger';
      default: return 'kt-font-brand';
    }
  }

  // Return icon class based on fee type
  getFeeIconClass(fee: ActiveFeeRateResponse) {
    switch (fee.name) {
      case 'ADMISSION': return 'flaticon2-graph-1 kt-font-info';
      case 'TUITION': return 'flaticon-pie-chart-1 kt-font-success';
      case 'TRANSPORT': return 'flaticon2-truck kt-font-danger';
      default: return 'flaticon2-graph-1 kt-font-brand';
    }
  }
  getTotalAmount(): string {
    let total = 0;


    this.getSelectedFeeCatalogs().forEach(fee => {
      const comps = this.selectedComponents[fee.id] || [];
      comps.forEach(comp => {
        const amount = this.getAmount(comp); // e.g., "PKR 5000"
        // Remove non-numeric characters and convert to number
        const numericAmount = Number(amount.replace(/[^0-9.-]+/g, ""));
        total += numericAmount;
      });
    });

    // Return formatted string (e.g., PKR 5000)
    return 'PKR ' + total;
  }


 
}


