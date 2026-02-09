import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StudentManagementService } from '../../services/student-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { FeeRateResponse } from '../../../fee-rate-management/models/FeeRateResponse';
import { ActiveFeeRateResponse, FeeComponent } from '../../models/ActiveFeeRateFormatedResponse';
import { DiscountRate } from '../../models/DiscountRate';
import { ActiveDiscountRateFullResponse, DiscountComponent } from '../../models/DiscountRateFormatedResponse';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentDiscountAssignmentResponse } from '../../models/StudentDiscountAssignmentResponse ';
import { StudentFeeAssignmentFlatDTO } from '../../models/StudentFeeAssignmentFlatDTO';


@Component({
  selector: 'app-fee-calculator-listing',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './student-fee-calculator.html',
  styleUrls: ['./student-fee-calculator.css'],
  standalone: true,
})
export class StudentFeeCaculator implements OnInit {
  academicYear: AcademicYearResponse | null = null;
  activeFeeRate: FeeRateResponse[] = []
  activeFeeRate_: ActiveFeeRateResponse[] = []
  selectedDiscounts: { [feeId: number]: DiscountComponent[] } = {};
  selectedComponents: { [feeId: number]: FeeComponent[] } = {}; // store selected components grouped by fee catalog
  activeDiscountRate_: ActiveDiscountRateFullResponse[] = [];
  discountAppliedAmount: number = 0;
  totalAmountBeforeDiscount: number = 0;
  isEditMode = false;
  assignmentId: number | null = null;
  studentDiscounts: StudentDiscountAssignmentResponse[] = [];
  studentAssignedFee: StudentFeeAssignmentFlatDTO[] = [];

  constructor(private studentManagementSerivce: StudentManagementService,
    private configService: AppConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService
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
    return rate ? `${rate.amount}` : '';
  }
  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.isEditMode = params['mode'] === 'edit';
      const apiParams = {
        studentId: params['studentId'],
        academicYearId: params['academicYearId'],
        campusId: params['campusId'],
        standardId: params['standardId']
      };
      this.logger.info('Query Params Object', apiParams);
      this.academicYear = this.configService.getAcademicYear();
      this.logger.info('academic Year', this.academicYear);
      this.getActiveDiscounts(apiParams);
      this.getActiveFeeRates(apiParams);
      if (this.isEditMode) {
        this.getStudentAssignedDiscount(apiParams.studentId, apiParams);
        this.getAssignedStudentFees(apiParams.studentId, apiParams.academicYearId);
      }

    });
  }

  private mapAssignedFeesToUI(assignments: StudentFeeAssignmentFlatDTO[]): void {

    if (!assignments.length || !this.activeFeeRate_.length) {
      this.logger.warn('Fee catalogs not loaded or no assignments');
      return;
    }

    this.logger.info('Mapping assigned FEES to UI');
    this.logger.debug('Assignments', assignments);

    // Reset first
    this.selectedComponents = {};

    assignments.forEach(assign => {

      this.logger.info('Processing assigned fee', assign);

      const feeCatalog = this.activeFeeRate_.find(
        f => f.id === assign.feeCatalogId
      );

      if (!feeCatalog) {
        this.logger.warn('Fee Catalog not found', assign.feeCatalogId);
        return;
      }

      const component = feeCatalog.components.find(
        c => c.id === assign.feeComponentId
      );

      if (!component) {
        this.logger.warn('Fee Component not found', assign.feeComponentId);
        return;
      }

      if (!this.selectedComponents[feeCatalog.id]) {
        this.selectedComponents[feeCatalog.id] = [];
      }

      const exists = this.selectedComponents[feeCatalog.id]
        .some(c => c.id === component.id);

      if (!exists) {
        this.selectedComponents[feeCatalog.id].push(component);

        this.logger.success('FEE COMPONENT MARKED');
        this.logger.debug('Fee component details', {
          feeCatalogId: feeCatalog.id,
          feeCatalogName: feeCatalog.name,
          feeComponentId: component.id,
          feeComponentName: component.name
        });
      }
    });

    this.logger.info('FINAL SELECTED FEES STATE', this.selectedComponents);

    this.calculateDiscount();
    this.updateTotals();
  }



  private getStudentAssignedDiscount(studentId: string, apiParams: any) {

    console.log('📤 Fetching assigned discounts');
    console.log('➡️ studentId:', studentId);
    console.log('➡️ apiParams:', apiParams);

    this.studentManagementSerivce
      .getAssignedStudentDiscounts(studentId, apiParams)
      .subscribe({

        next: (response) => {
          console.log('✅ Assigned discounts fetched successfully');
          console.log('📦 HTTP Status:', response.status);
          console.log('📦 Response Body:', response.body);

          this.studentDiscounts = response.body || [];

          if (!this.studentDiscounts.length) {
            console.warn('⚠️ No discounts assigned to this student');
          } else {
            console.table(this.studentDiscounts);
            setTimeout(() => {
              if (this.activeDiscountRate_ && this.activeDiscountRate_.length) {
                this.mapAssignedDiscountsToUI();
              } else {
                console.warn('⚠️ Discount catalog not loaded yet, retrying in 100ms...');
                setTimeout(() => this.mapAssignedDiscountsToUI(), 100); // small retry
              }
            }, 100);
          }
        },

        error: (error) => {
          console.error('❌ Error fetching assigned discounts');
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Full Error:', error);
        },

        complete: () => {
          console.log('🔚 getStudentAssignedDiscount completed');
        }
      });
  }


  isFeeComponentSelected(fee: ActiveFeeRateResponse, comp: FeeComponent): boolean {
    return this.selectedComponents[fee.id]?.some(c => c.id === comp.id) || false;
  }
  private getActiveFeeRates(apiParams: any) {
    this.studentManagementSerivce.getActiveFeeRates(apiParams).subscribe({
      next: (response) => {
        const data: FeeRateResponse[] = response.body;

        const catalogs = Array.from(
          new Set(data.map(d => d.feeComponent.feeCatalog.id))
        ).map(catalogId => {

          const catalogRates = data.filter(
            d => d.feeComponent.feeCatalog.id === catalogId
          );

          const catalog = catalogRates[0].feeComponent.feeCatalog;

          const components = Array.from(
            new Set(catalogRates.map(d => d.feeComponent.id))
          ).map(compId => {

            const compRates = catalogRates.filter(
              d => d.feeComponent.id === compId
            );

            const component = compRates[0].feeComponent;

            return {
              id: component.id,
              name: component.componentName,
              chargeType: component.feeCatalog.chargeType,           // FIXED / VARIABLE
              recurrenceRule: component.feeCatalog.recurrenceRule,   // MONTHLY / ONE_TIME
              discountable: component.discountable,      // true / false

              rates: compRates,
              randomClass: this.getRandomClass()
            };
          });

          return {
            id: catalog.id,
            name: catalog.name,
            components
          };
        });

        this.activeFeeRate_ = catalogs;

        console.log('Grouped Fee Rates (Extended):', this.activeFeeRate_);
      },
      error: (error) => console.error(error)
    });
  }


  private getActiveDiscounts(apiParams: any) {
    this.studentManagementSerivce.getActiveDiscounts(apiParams).subscribe({
      next: (response) => {
        console.log('  Request Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        const data: DiscountRate[] = response.body; // the raw discount rates

        // Group by Discount Type (like catalog)
        const discountTypes = Array.from(new Set(data.map(d => d.discountSubType.discountType.id)))
          .map(typeId => {
            const typeRates = data.filter(d => d.discountSubType.discountType.id === typeId);
            const typeName = typeRates[0].discountSubType.discountType.name;

            // Group by Discount SubType (like component)
            const components = Array.from(new Set(typeRates.map(d => d.discountSubType.id)))
              .map(subTypeId => {
                const subTypeRates = typeRates.filter(d => d.discountSubType.id === subTypeId);
                const subTypeName = subTypeRates[0].discountSubType.name;

                return {
                  id: subTypeId,
                  name: subTypeName,
                  rates: subTypeRates,
                  randomClass: this.widgetClasses[Math.floor(Math.random() * this.widgetClasses.length)]
                };
              });

            return {
              id: typeId,
              name: typeName,
              components
            };
          });

        this.activeDiscountRate_ = discountTypes;

        console.log('Grouped Discount Rates:', this.activeDiscountRate_);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }


  private updateTotals() {
    this.totalAmountBeforeDiscount = this.getTotalSelectedFee();
    this.calculateDiscount();
  }

  toggleDiscountSelection(type: ActiveDiscountRateFullResponse, subType: DiscountComponent, event: any) {

    // Uncheck everything
    this.selectedDiscounts = {};

    if (event.target.checked) {
      this.selectedDiscounts[type.id] = [subType];
    }
    this.calculateDiscount();
    this.updateTotals();
  }

  isDiscountSelected(type: ActiveDiscountRateFullResponse, subType: DiscountComponent): boolean {
    return this.selectedDiscounts[type.id]?.some(s => s.id === subType.id) || false;
  }


  toggleSelection(fee: ActiveFeeRateResponse, comp: FeeComponent, event: any) {
    if (!this.selectedComponents[fee.id]) this.selectedComponents[fee.id] = [];

    if (event.target.checked) {
      this.selectedComponents[fee.id].push(comp);
    } else {
      this.selectedComponents[fee.id] = this.selectedComponents[fee.id].filter(c => c.id !== comp.id);
      if (this.selectedComponents[fee.id].length === 0) delete this.selectedComponents[fee.id];
    }
    this.calculateDiscount();
    this.updateTotals();
  }


  getSelectedDiscounts(): ActiveDiscountRateFullResponse[] {
    return this.activeDiscountRate_.filter(type => this.selectedDiscounts[type.id]?.length);
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

  getTotalSelectedFee(): number {
    let total = 0;

    this.getSelectedFeeCatalogs().forEach(fee => {
      const comps = this.selectedComponents[fee.id] || [];
      comps.forEach(comp => {
        total += this.calculateComponentAmount(comp);
      });
    });
    return total;
  }


  calculateDiscount() {
    let discountableTotal = 0;
    this.getSelectedFeeCatalogs().forEach(fee => {
      const comps = this.selectedComponents[fee.id] || [];
      comps.forEach(comp => {
        if (comp.discountable) {
          discountableTotal += this.calculateComponentAmount(comp);
        }
      });
    });

    let discount = 0;
    this.getSelectedDiscounts().forEach(type => {
      const subTypes = this.selectedDiscounts[type.id] || [];
      subTypes.forEach(subType => {
        const rate = subType.rates[0];
        if (!rate) return;

        if (rate.isPercentage) {
          discount = (discountableTotal * rate.value) / 100;
        } else {
          discount = rate.value;
        }
      });
    });

    this.discountAppliedAmount = discount;
  }


  getTotalAmount(): string {
    const totalFee = this.getTotalSelectedFee();
    const finalAmount = Math.max(totalFee - this.discountAppliedAmount, 0);
    return 'PKR ' + finalAmount;
  }


  getSelectedFeeComponentIds(): number[] {
    return Object.values(this.selectedComponents)
      .flat()
      .map(comp => comp.id);
  }


  submitFeeAndDiscount() {
    // Extract query params from route or store them somewhere
    const params = this.activatedRoute.snapshot.queryParams;
    const apiParams = {
      studentId: params['studentId'],
      academicYearId: params['academicYearId'],
      campusId: params['campusId'],
      standardId: params['standardId']
    };

    // Prepare the component IDs
    const componentIds = this.getSelectedFeeComponentIds();
    const discountComponentId = this.getSelectedDiscountComponentId();

    // Prepare the DTO
    const requestDto = {
      studentId: apiParams.studentId,
      campusId: apiParams.campusId,
      standardId: apiParams.standardId,
      academicYearId: apiParams.academicYearId,
      componentIds: componentIds,
      discountComponentId: discountComponentId,
      assignedDate: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      dueDate: new Date().toISOString().split('T')[0] // you can replace with actual due date
    };

    console.log(`${this.isEditMode ? 'Updating' : 'Assigning'} student fee:`, requestDto);

    const serviceCall = this.isEditMode
      ? this.studentManagementSerivce.updateStudentAssignFee(apiParams.studentId, requestDto)
      : this.studentManagementSerivce.studentAssignFee(apiParams.studentId, requestDto);
    // Send to API
    serviceCall.subscribe({
      next: (response) => {
        console.log('Fee assigned successfully', response);
        this.router.navigate(ROUTES.STUDENT.DETAILS(apiParams.studentId))
      },
      error: (err) => {
        console.error('Error assigning fee', err);
      }
    });
  };


  getSelectedDiscountComponentId(): number | null {
    const selected = Object.values(this.selectedDiscounts).flat();
    return selected.length > 0 ? selected[0].id : null;
  }

  calculateComponentAmount(
    comp: FeeComponent,
    context?: {
      totalCredits?: number;
      subjectCount?: number;
      usageUnits?: number;
    }
  ): number {

    const rate = comp.rates?.[0];
    if (!rate) return 0;

    const baseAmount = rate.amount;
    const recurrence = this.getRecurrenceMultiplier(comp.recurrenceRule);


    switch (comp.chargeType) {

      case 'FIXED':
      case 'VARIABLE':
      case 'DISCOUNTED':
        return baseAmount * recurrence;

      case 'PER_CREDIT':
        return (context?.totalCredits ?? 0) * baseAmount * recurrence;

      case 'PER_SUBJECT':
        return (context?.subjectCount ?? 0) * baseAmount * recurrence;

      case 'USAGE_BASED':
        return (context?.usageUnits ?? 0) * baseAmount;

      case 'SLAB_BASED':
        // Slab logic handled in backend
        return baseAmount * recurrence;

      case 'PERCENTAGE':
        // Applied elsewhere (discount / penalty)
        return 0;

      default:
        return 0; //   SAFETY NET
    }
  }


  private mapAssignedDiscountsToUI(): void {

    if (!this.studentDiscounts.length || !this.activeDiscountRate_.length) {
      console.warn('⚠️ No discounts or discount catalog not loaded');
      return;
    }

    // Reset first (important for edit → edit navigation)
    this.selectedDiscounts = {};

    this.studentDiscounts.forEach(assigned => {

      const discountType = this.activeDiscountRate_.find(
        t => t.id === assigned.discountTypeId
      );
      if (!discountType) return;

      const subType = discountType.components.find(
        c => c.id === assigned.discountSubTypeId
      );
      if (!subType) return;

      // 🔑 Mark checkbox
      this.selectedDiscounts[discountType.id] = [subType];

      console.log('✅ Marked discount:', {
        discountType: discountType.name,
        subType: subType.name
      });
    });

    // Recalculate totals
    this.calculateDiscount();
    this.updateTotals();
  }


  getAssignedStudentFees(studentId: number, academicYearId: number) {
    console.log('📤 Fetching assigned discounts');
    console.log('➡️ studentId:', studentId);
    const apiParams = {
      academicYearId: academicYearId
    }
    this.studentManagementSerivce
      .getAssignedStudentFee(studentId.toString(), apiParams)
      .subscribe({

        next: (response) => {
          console.log('✅ Assigned discounts fetched successfully');
          console.log('📦 HTTP Status:', response.status);
          console.log('📦 Response Body:', response.body);

          this.studentAssignedFee = response.body || [];

          if (!this.studentAssignedFee.length) {
            console.warn('⚠️ No Fee assigned to this student');
          } else {
            console.table(this.studentAssignedFee);
            setTimeout(() => {
              if (this.activeFeeRate_ && this.activeFeeRate_.length) {
                this.mapAssignedFeesToUI(this.studentAssignedFee);
              } else {
                console.warn('⚠️ Discount catalog not loaded yet, retrying in 100ms...');
                setTimeout(() => this.mapAssignedFeesToUI(this.studentAssignedFee), 100); // small retry
              }
            }, 500);
          }
        },

        error: (error) => {
          console.error('❌ Error fetching assigned discounts');
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Full Error:', error);
        },

        complete: () => {
          console.log('🔚 getStudentAssignedDiscount completed');
        }
      });
  }

  private getRecurrenceMultiplier(rule: string): number {
    if (!this.academicYear || !this.academicYear.totalMonths) return 1;

    const totalMonths = Math.floor(this.academicYear.totalMonths); // cast/ensure integer

    switch (rule) {
      case 'ONE_TIME':
        return 1;
      case 'MONTHLY':
        return totalMonths; // usually 12 or as per AcademicYearEntity
      case 'BI_MONTHLY':
        return Math.floor(totalMonths / 2); // every 2 months
      case 'QUARTERLY':
        return Math.floor(totalMonths / 4); // every 3 months
      case 'HALF_YEARLY':
        return Math.floor(totalMonths / 2); // twice a year
      case 'YEARLY':
        return 1;
      case 'TERM_WISE':
        return 2; // can adjust based on your system
      case 'SEMESTER_WISE':
        return 2; // can adjust based on your system
      default:
        return 1; // fallback
    }
  }


  onCancel() {
    this.router.navigate(ROUTES.STUDENT.LIST)
  }
}



