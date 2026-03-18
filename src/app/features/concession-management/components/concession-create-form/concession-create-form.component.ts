import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ConcessionManagementService } from '../../services/concession-management.service';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { ChargeTypeManagementService } from '../../../charge-type-management/services/charge-type-management.service';
import { FeeRecurrenceRuleManagementService } from '../../../fee-recurrence-rule-management/services/fee-recurrence-rule-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-concession-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './concession-create-form.component.html',
  styleUrls: ['./concession-create-form.component.css']
})
export class ConcessionCreateFormComponent implements OnInit {

  createForm!: FormGroup;
  isLoading = false;
  loadingMessage = '';
  isEditMode = false;
  concessionId: string | null = null;

  chargeTypeOptions: KeyValueOption[] = [];
  recurrenceRuleOptions: KeyValueOption[] = [];

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  private readonly MODULE = 'ConcessionType';
  private readonly COMPONENT = 'ConcessionTypeForm';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private concessionManagementService: ConcessionManagementService,
    private chargeTypeService: ChargeTypeManagementService,
    private recurrenceRuleService: FeeRecurrenceRuleManagementService,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();

    this.concessionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.concessionId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    this.loadDropdowns();

    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Component initialization complete');
    LoggerUtil.groupEnd();
  }

  private initializeForm(): void {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);

    this.createForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]],
      name: ['', [Validators.required, Validators.maxLength(150), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(500)]],
      active: [true],
      chargeTypeId: ['', Validators.required],
      recurrenceRuleId: [''],
      priority: [null],
      displayOrder: [null]
    });

    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd();
  }

  private loadDropdowns(): void {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Dropdowns`);
    this.isLoading = true;
    this.loadingMessage = 'Loading Options...';

    // Load Charge Types
    this.chargeTypeService.getActive().subscribe({
      next: (response: any) => {
        const items = response.body || [];
        this.chargeTypeOptions = items.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
        LoggerUtil.log(this.MODULE, 'ChargeType', '✅ Charge types loaded', this.chargeTypeOptions.length);
      },
      error: (error: any) => {
        LoggerUtil.error(this.MODULE, 'ChargeType', '❌ Failed to load charge types', error);
      }
    });

    // Load Recurrence Rules
    this.recurrenceRuleService.getAllFeeRecurrenceRules().subscribe({
      next: (response: any) => {
        const items = response.body || [];
        this.recurrenceRuleOptions = items.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
        LoggerUtil.log(this.MODULE, 'RecurrenceRule', '✅ Recurrence rules loaded', this.recurrenceRuleOptions.length);
      },
      error: (error: any) => {
        LoggerUtil.error(this.MODULE, 'RecurrenceRule', '❌ Failed to load recurrence rules', error);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        LoggerUtil.groupEnd();
        // Load details after dropdowns are ready (edit mode)
        if (this.isEditMode && this.concessionId) {
          this.loadConcessionDetails(this.concessionId);
        }
      }
    });
  }

  loadConcessionDetails(id: string): void {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Details`);
    LoggerUtil.log(this.MODULE, 'Details', '📌 Fetching concession type by ID', id);
    this.isLoading = true;
    this.loadingMessage = 'Loading Concession Type Details...';

    this.concessionManagementService.getConcessionById(id).subscribe({
      next: (response: any) => {
        const data = response.body;
        LoggerUtil.log(this.MODULE, 'Details', '✅ Concession type data loaded', data);

        this.createForm.patchValue({
          code: data.code,
          name: data.name,
          description: data.description,
          active: data.active,
          chargeTypeId: data.chargeType?.id?.toString(),
          recurrenceRuleId: data.recurrenceRule?.id?.toString(),
          priority: data.priority,
          displayOrder: data.displayOrder
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loadingMessage = '';
        LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load concession type details', error);
        this.toaster?.show('Failed to load concession type details.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        LoggerUtil.log(this.MODULE, 'Details', '🔚 Details flow completed');
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

    const formValue = this.createForm.getRawValue();
    const payload = {
      ...formValue,
      chargeTypeId: formValue.chargeTypeId ? Number(formValue.chargeTypeId) : null,
      recurrenceRuleId: formValue.recurrenceRuleId ? Number(formValue.recurrenceRuleId) : null,
      priority: formValue.priority ? Number(formValue.priority) : null,
      displayOrder: formValue.displayOrder ? Number(formValue.displayOrder) : null
    };

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form data', payload);

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating Concession Type...' : 'Adding New Concession Type...';

    this.concessionManagementService.saveConcession(this.concessionId, payload).subscribe({
      next: (response: any) => {
        LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', response.body);
        const message = response?.body?.message || (this.isEditMode ? 'Concession Type updated successfully' : 'Concession Type created successfully');
        this.toaster?.show(message, 'success');
        setTimeout(() => {
          this.goToListing();
        }, 1500);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loadingMessage = '';
        LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error);
        this.toaster?.show('Failed to save Concession Type.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  goToListing(): void {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to concession listing');
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.LIST);
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
    code: {
      required: 'Code is required.',
      maxlength: 'Code cannot exceed 20 characters.',
      whitespace: 'Code cannot be empty or whitespace only.'
    },
    name: {
      required: 'Name is required.',
      maxlength: 'Name cannot exceed 150 characters.',
      whitespace: 'Name cannot be empty or whitespace only.'
    },
    chargeTypeId: {
      required: 'Charge Type is required.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.'
    }
  };

  // Getters
  get code() { return this.createForm.get('code'); }
  get name() { return this.createForm.get('name'); }
  get chargeTypeId() { return this.createForm.get('chargeTypeId'); }
  get recurrenceRuleId() { return this.createForm.get('recurrenceRuleId'); }
  get description() { return this.createForm.get('description'); }
}

// 📌 — important info/start of action // ⚙️ — initializing component/form // 🔄 — subscription/change event // 📤 — sending data // 📦 — data loaded // ✅ — success // ❌ — error // 🔚 — end of flow // ➡️ — navigation