import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryComponentService } from '../../services/salary-component.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-salary-component-create-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './salary-component-create-form.component.html',
  styleUrl: './salary-component-create-form.component.css'
})
export class SalaryComponentCreateFormComponent {
   form!: FormGroup;
  isEditMode = false;
  componentId: string | null = null;

  componentTypes = [
    { key: 'EARNING', label: 'Earning' },
    { key: 'DEDUCTION', label: 'Deduction' }
  ];

  percentageOptions = [
    { key: true, label: 'Percentage (%)' },
    { key: false, label: 'Fixed Amount' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salaryComponentService: SalaryComponentService
  , private logger: LoggerService) {}

  ngOnInit(): void {
    this.initForm();

    this.componentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.componentId;

    if (this.isEditMode) {
      this.loadComponent(this.componentId!);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      type: ['', Validators.required],
      isPercentage: ['', Validators.required]
    });
  }

  private loadComponent(id: string): void {
    this.salaryComponentService.getSalaryComponentById(id).subscribe({
      next: res => this.form.patchValue(res.body),
      error: err => console.error('Load failed', err)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    this.salaryComponentService.saveSalaryComponent(this.componentId, payload).subscribe({
      next: () => this.router.navigate(ROUTES.SALARY_COMPONENT.LIST),
      error: err => console.error('Save failed', err)
    });
  }

  cancel(): void {
    this.router.navigate(ROUTES.SALARY_COMPONENT.LIST);
  }

  // helpers
  get f() { return this.form.controls; }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) {
      return { whitespace: true };
    }
    return null;
  }
  get name() {
  return this.form.get('name');
}

  get type() { return this.form.get('type'); }
  get isPercentage() { return this.form.get('isPercentage'); }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) return 'This field is required';
    return '';
  }

}
