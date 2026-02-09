import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogManagementService } from '../../services/fee-catalog-management.service';
import { FeeCatalogResponse } from '../../models/FeeCatalogResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-fee-catalog-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fee-catalog-create-form.component.html',
  styleUrls: ['./fee-catalog-create-form.component.css']
})
export class FeeCatalogCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  isEditMode = false;
  resourceData: FeeCatalogResponse | null = null;

  recurrenceRuleOptions: KeyValueOption[] = [];
  chargeTypeOptions: KeyValueOption[] = [];

  private readonly MODULE = 'FeeCatalog';
  private readonly COMPONENT = 'FeeCatalogForm';

  constructor(
    private feeCatalogManagementService: FeeCatalogManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  , private logger: LoggerService) {}

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();
    this.getFeeCatalogMeta();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode && this.routedId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Routed ID found', this.routedId);
      this.getFeeCatalogDetails(this.routedId);
    }

    LoggerUtil.groupEnd(); // Close Init group
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);

    this.createForm = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.maxLength(20), this.noWhitespaceValidator]],
      active: [true],
      chargeType: ['', Validators.required],
      recurrenceRule: ['', Validators.required],
      description: ['', [Validators.maxLength(500), this.noWhitespaceValidator]]
    });

    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd();
  }

  private getFeeCatalogMeta() {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Meta`);
    this.feeCatalogManagementService.getFeeCatalogMeta().subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'Meta', '📦 Response Body', response.body);

        this.recurrenceRuleOptions = Object.entries(response.body.recurrenceRules).map(
          ([key, label]) => ({ key, label: label as string })
        );

        this.chargeTypeOptions = Object.entries(response.body.chargeTypes).map(
          ([key, label]) => ({ key, label: label as string })
        );

        LoggerUtil.log(this.MODULE, 'Meta', '✅ Meta loaded', {
          recurrenceRuleOptions: this.recurrenceRuleOptions,
          chargeTypeOptions: this.chargeTypeOptions
        });
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Meta', '❌ Failed to load meta', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Meta', '🔚 Meta request completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  onSubmit(): void {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, 'Submit', '📋 Form submit triggered');

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', this.createForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form data', this.createForm.getRawValue());

    this.feeCatalogManagementService.saveFeeCatalog(this.routedId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', response.body);
        LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to fee catalog list');
        this.router.navigate(ROUTES.FEE.FEE_CATALOG.LIST);
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  getFeeCatalogDetails(routedId: string): void {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Fee Catalog Details`);
    LoggerUtil.log(this.MODULE, 'Details', '📌 Fetching fee catalog by ID', routedId);

    this.feeCatalogManagementService.getFeeCatalogById(routedId).subscribe({
      next: (response) => {
        this.resourceData = response.body;
        LoggerUtil.log(this.MODULE, 'Details', '✅ Fee catalog data loaded', this.resourceData);

        this.createForm.patchValue(this.resourceData ?? {});
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load fee catalog', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Details', '🔚 Fee catalog details flow completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  goToFeeCatalogList(): void {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to fee catalog list');
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.LIST);
  }

  // Validators
  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }
    return '';
  }

  validationMessages = {
    name: {
      required: 'Name is required.',
      whitespace: 'Name cannot be empty or whitespace only.'
    },
    code: {
      maxlength: 'Code cannot exceed 20 characters.',
      whitespace: 'Code cannot be empty.'
    },
    chargeType: { required: 'Charge Type is required.' },
    recurrenceRule: { required: 'Recurrence Rule is required.' },
    description: {
      maxlength: 'Description cannot exceed 500 characters.',
      whitespace: 'Description cannot be empty.'
    }
  };

  // Getters
  get name() { return this.createForm.get('name'); }
  get code() { return this.createForm.get('code'); }
  get chargeType() { return this.createForm.get('chargeType'); }
  get recurrenceRule() { return this.createForm.get('recurrenceRule'); }
  get description() { return this.createForm.get('description'); }
  get active() { return this.createForm.get('active'); }
}
