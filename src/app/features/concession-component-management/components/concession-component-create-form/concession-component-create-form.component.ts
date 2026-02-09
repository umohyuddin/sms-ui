import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionComponentResponse } from '../../models/ConcessionComponentResponse';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-concession-component-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './concession-component-create-form.component.html',
  styleUrls: ['./concession-component-create-form.component.css']
})
export class ConcessionComponentCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  concessionDD: ConcessionResponse[] = [];
  resourceData?: ConcessionComponentResponse;
  isEditMode: boolean = false;
  private readonly MODULE = 'ConcessionComponent';
  private readonly COMPONENT = 'CreateForm';

  constructor(
    private ConcessionManagementService: ConcessionManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing form and fetching data');

    this.initializeForm();
    this.getConcessionCatalogs();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode && this.routedId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Fetching existing concession component', this.routedId);
      this.getConcessionComponentDetails(this.routedId);
    }

    LoggerUtil.groupEnd(); // End Init
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);

    this.createForm = this.fb.group({
      discountTypeId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      code: ['', [Validators.maxLength(15), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(500), this.noWhitespaceValidator]],
      isActive: [true]
    });

    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized', this.createForm.value);
    LoggerUtil.groupEnd();
  }

  private getConcessionCatalogs() {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Concessions`);
    this.ConcessionManagementService.getAllConcessions().subscribe({
      next: (response) => {
        this.concessionDD = response.body;
        LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Concessions loaded', this.concessionDD);
      },
      error: (error) => LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load concessions', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, this.COMPONENT, '🔚 Concessions load complete');
        LoggerUtil.groupEnd();
      }
    });
  }

  getConcessionComponentDetails(routedId: string): void {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Component Details`);
    this.concessionComponentManagementService.getConcessionComponentById(routedId)
      .subscribe({
        next: (response) => {
          this.resourceData = response.body;
          LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Component data loaded', this.resourceData);

          this.createForm.patchValue({
            discountTypeId: this.resourceData?.discountType.id,
            name: this.resourceData?.name,
            code: this.resourceData?.code,
            description: this.resourceData?.description || '',
            isActive: this.resourceData?.isActive
          });
        },
        error: (error) => LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load component', error),
        complete: () => {
          LoggerUtil.log(this.MODULE, this.COMPONENT, '🔚 Component details load complete');
          LoggerUtil.groupEnd();
        }
      });
  }

  onSubmit(): void {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📋 Form submit triggered', this.createForm.getRawValue());

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Form is invalid', this.createForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    this.concessionComponentManagementService.saveConcessionComponent(this.routedId, this.createForm.getRawValue())
      .subscribe({
        next: (response) => {
          LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Save successful', response.body);
          LoggerUtil.log(this.MODULE, this.COMPONENT, '➡️ Navigating to concession list');
          this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.LIST);
        },
        error: (error) => LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Save failed', error),
        complete: () => {
          LoggerUtil.log(this.MODULE, this.COMPONENT, '🔚 Submit flow completed');
          LoggerUtil.groupEnd();
        }
      });
  }

  goToSectionsList(): void {
    LoggerUtil.log(this.MODULE, this.COMPONENT, '➡️ Redirecting to concession list');
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.LIST);
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

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  // Form Getters
  get discountTypeId() { return this.createForm.get('discountTypeId'); }
  get name() { return this.createForm.get('name'); }
  get code() { return this.createForm.get('code'); }
  get description() { return this.createForm.get('description'); }
  get isActive() { return this.createForm.get('isActive'); }

  validationMessages = {
    name: {
      required: 'Name is required.',
      maxlength: 'Name cannot exceed 50 characters.',
      whitespace: 'Name cannot be empty or whitespace only.'
    },
    code: {
      maxlength: 'Code cannot exceed 15 characters.',
      whitespace: 'Code cannot be empty or whitespace only.'
    },
    discountTypeId: {
      required: 'Discount Type is required.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.',
      whitespace: 'Description cannot be empty or whitespace only.'
    },
    isActive: {
      required: 'Status is required.'
    }
  };
}
