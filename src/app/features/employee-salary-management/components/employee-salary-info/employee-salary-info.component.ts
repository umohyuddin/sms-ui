import { Component } from '@angular/core';
import { EmployeeSalaryFullResponse } from '../../models/EmployeeSalary';
import { EmployeeSalaryService } from '../../services/employee-salary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { SalaryPaymentService } from '../../../salary-payment-management/services/salary-payment.service';
import { SalaryPayment } from '../../models/SalaryPayment';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-employee-salary-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-salary-info.component.html',
  styleUrl: './employee-salary-info.component.css'
})
export class EmployeeSalaryInfoComponent {
  employeeSalaryData?: EmployeeSalaryFullResponse;
  routedId!: string;
  payments?: SalaryPayment[] = [];
  createCampusForm!: FormGroup;
  paymentModeDD: KeyValueOption[] = [];
  private readonly MODULE = 'Campus';
  private readonly COMPONENT = 'CampusForm';
  isViewMode = false;
  isPayMode = false;
  constructor(
    private fb: FormBuilder,
    private salaryPayment: SalaryPaymentService,
    private employeeSalaryManagementService: EmployeeSalaryService,
    private route: ActivatedRoute,
    private router: Router
  , private logger: LoggerService) { }

  private loadPaymentModes(): void {
    this.paymentModeDD = [
      { key: 'CASH', label: 'Cash' }
    ];
  }

  columns = [
    { key: 'paymentDate', label: 'Payment Date' },
    { key: 'paymentDate', label: 'Payment Month' },
    { key: 'paymentDate', label: 'Payment year' },
    { key: 'paymentMode', label: 'Payment Mode' },
    { key: 'transactionReference', label: 'Transaction Ref' },
    { key: 'amountPaid', label: 'Amount Paid' },
    { key: 'remarks', label: 'Remarks' }
  ];
  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';

    this.route.queryParams.subscribe(params => {
      const salaryId = params['salaryId'];
      const mode = params['mode'];

      console.log('Salary ID:', salaryId);
      console.log('Mode:', mode);
      this.isViewMode = mode === 'view';
      this.isPayMode = mode === 'pay';

      if (this.isViewMode) {
        this.createCampusForm?.disable();
      }
    });
    console.log('Employee ID from route:', this.routedId);
    this.loadPaymentModes();
    this.initializeForm();
    this.getEmployeeSalaryDetails(this.routedId);
    this.getSalaryPayments(this.routedId);
  }


  getSalaryPayments(employeeId: string): void {
    this.salaryPayment.getPaymentsByEmployeeId(Number(employeeId)).subscribe({
      next: (res) => {
        this.payments = res.body ?? [];
        console.log('Salary Payments:', this.payments);
      },
      error: (err) => console.error('Failed to fetch salary payments:', err)
    });
  }
  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createCampusForm = this.fb.group({
      employeeId: [this.routedId, Validators.required],
      paymentDate: [new Date(), Validators.required],
      paymentMode: ['', Validators.required],

      remarks: ['', [Validators.maxLength(255), this.noWhitespaceValidator]]
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd(); // Close Form Initialization group
  }
  getEmployeeSalaryDetails(routedId: string): void {
    this.employeeSalaryManagementService.getEmployeeSalaryById(routedId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeSalaryData = response.body;
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

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }

  isSubmitting = false;

  onSubmit(): void {
    if (this.isViewMode) {
      return; // ⛔ never allow submit in view mode
    }
    // Validate form
    if (this.createCampusForm.invalid) {
      this.createCampusForm.markAllAsTouched();
      return;
    }

    // Prevent double submission
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;

    const formData = this.createCampusForm.getRawValue();

    const payload = {
      employeeId: Number(formData.employeeId),
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      amountPaid: Number(this.employeeSalaryData?.netSalary), // comes from salary
      remarks: formData.remarks
    };

    console.log('💰 Salary Payment Payload:', payload);

    // Call API
    this.salaryPayment.createPayment(payload).subscribe({
      next: (res) => {
        console.log('✅ Salary Payment Successful:', res.body);
        this.createCampusForm.disable();
        this.getSalaryPayments(this.routedId);
      },
      error: (err) => {
        console.error('❌ Salary Payment Failed:', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
        console.log('🔚 Payment request completed');
      }
    });
  }
  goToListing() {
    this.router.navigate(ROUTES.EMPLOYEE_SALARY.LIST)
}

  get paymentMode() {
    return this.createCampusForm.get('paymentMode');
  }
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && !control.value.trim()) {
      return { whitespace: true };
    }
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createCampusForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  validationMessages = {
    employeeId: {
      required: 'EmployeeId is required.',
    },
    paymentMode: {
      required: 'payment method is required.'
    },
    remarks: {
      maxlength: 'Remarks cannot exceed 500 characters.',
      whitespace: 'Remarks cannot be empty.'
    }
  };
}
