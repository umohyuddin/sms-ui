import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';
import { FeeCatalogComponentManagementService } from '../../services/fee-catalog-component-management.service';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { FeeComponentResponseDTO } from '../../models/FeeComponentResponseDTO';

@Component({
  selector: 'app-fee-catalog-component-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fee-catalog-component-create-form.component.html',
  styleUrls: ['./fee-catalog-component-create-form.component.css']
})
export class FeeCatalogComponentCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  feeCatalogDD: FeeCatalogResponse[] = [];
  feeCatalogComponentData?: FeeComponentResponseDTO;
  isEditMode: boolean = false;
  isVisible: boolean = false;
  @Output() saved = new EventEmitter<void>();
  private readonly MODULE = 'FeeCatalogComponent';
  private readonly COMPONENT = 'Form';

  validationMessages = {
    feeCatalogId: { required: 'Fee Catalog selection is required.' },
    componentName: {
      required: 'Component Name is required.',
      maxlength: 'Component Name cannot exceed 150 characters.',
      whitespace: 'Component Name cannot be empty or whitespace only.'
    },
    componentCode: {
      maxlength: 'Component Code cannot exceed 50 characters.',
      whitespace: 'Component Code cannot be empty.'
    },
    description: { maxlength: 'Description cannot exceed 500 characters.' }
  };

  constructor(
    private feeCatalogManagementService: FeeCatalogManagementService,
    private feeCatalogComponentManagementService: FeeCatalogComponentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();
    this.loadFeeCatalogs();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode && this.routedId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Edit mode - Load component ID', this.routedId);
      this.loadFeeComponentDetails(this.routedId);
    }

    LoggerUtil.groupEnd(); // Close Init group
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createForm = this.fb.group({
      feeCatalogId: ['', Validators.required],
      componentName: ['', [Validators.required, Validators.maxLength(150), this.noWhitespaceValidator]],
      componentCode: ['', [Validators.maxLength(50), this.noWhitespaceValidator]],
      // description: ['', [Validators.maxLength(500)]],
      active: [true],
      discountable: [false]
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd();
  }

  private loadFeeCatalogs() {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Fee Catalogs`);
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        this.feeCatalogDD = response.body || [];
        LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Fee catalogs loaded', this.feeCatalogDD);
      },
      error: (error) => LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load fee catalogs', error),
      complete: () => LoggerUtil.groupEnd()
    });
  }

  private loadFeeComponentDetails(componentId: string) {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Component Details`);
    this.feeCatalogComponentManagementService.getFeeCatalogComponentById(componentId).subscribe({
      next: (response) => {
        this.feeCatalogComponentData = response.body;
        LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Component data loaded', this.feeCatalogComponentData);

        this.createForm.patchValue({
          feeCatalogId: this.feeCatalogComponentData?.feeCatalog?.id,
          componentName: this.feeCatalogComponentData?.componentName,
          componentCode: this.feeCatalogComponentData?.componentCode,
          //description: this.feeCatalogComponentData?.description || '',
          active: this.feeCatalogComponentData?.active,
          discountable: this.feeCatalogComponentData?.discountable
        });
      },
      error: (error) => LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load component details', error),
      complete: () => LoggerUtil.groupEnd()
    });
  }

  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📋 Form submit triggered', this.createForm.getRawValue());

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Form validation failed', this.createForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    this.feeCatalogComponentManagementService.saveFeeCatalogComponent(this.routedId, this.createForm.getRawValue())
      .subscribe({
        next: (response) => {
          LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Save successful', response.body);
          this.saved.emit();
          this.close();
        },
        error: (error) => LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Save failed', error),
        complete: () => LoggerUtil.groupEnd()
      });
  }

  goToListing() {
    this.close();
  }

  show(id: string | null = null) {
    this.routedId = id;
    this.isEditMode = !!id;
    this.isVisible = true;
    this.initializeForm();
    if (this.isEditMode && id) {
      this.loadFeeComponentDetails(id);
    }
  }

  close() {
    this.isVisible = false;
  }

  // Getters for form controls
  get feeCatalogId() { return this.createForm.get('feeCatalogId'); }
  get componentName() { return this.createForm.get('componentName'); }
  get componentCode() { return this.createForm.get('componentCode'); }
  get description() { return this.createForm.get('description'); }
  get active() { return this.createForm.get('active'); }
  get discountable() { return this.createForm.get('discountable'); }

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
}
