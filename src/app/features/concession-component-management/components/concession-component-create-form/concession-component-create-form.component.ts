import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-concession-component-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './concession-component-create-form.component.html',
  styleUrls: ['./concession-component-create-form.component.css']
})
export class ConcessionComponentCreateFormComponent implements OnInit {
  isLoading = false;
  loadingMessage = '';
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  createForm!: FormGroup;
  routedId: string | null = null;
  concessionDD: ConcessionResponse[] = [];
  isEditMode: boolean = false;

  private readonly MODULE = 'ConcessionComponent';
  private readonly COMPONENT = 'CreateForm';

  constructor(
    private concessionManagementService: ConcessionManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.initializeForm();
    
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    this.getConcessionCatalogs();
    LoggerUtil.groupEnd();
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(15), this.noWhitespaceValidator]],
      name: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(500)]],
      discountTypeId: ['', Validators.required],
      isActive: [true],
      priority: [1],
      displayOrder: [1]
    });
    LoggerUtil.groupEnd();
  }

  private getConcessionCatalogs() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Dropdowns...';
    this.concessionManagementService.getActiveConcessions().subscribe({
      next: (response) => {
        this.concessionDD = response.body;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load concessions', error);
      },
      complete: () => {
        this.isLoading = false;
        if (this.isEditMode && this.routedId) {
          this.getConcessionComponentDetails(this.routedId);
        }
      }
    });
  }

  getConcessionComponentDetails(routedId: string | number): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading details...';
    this.concessionComponentManagementService.getConcessionComponentById(routedId)
      .subscribe({
        next: (response) => {
          const resourceData = response.body;
          this.createForm.patchValue({
            code: resourceData?.code,
            name: resourceData?.name,
            description: resourceData?.description || '',
            discountTypeId: resourceData?.discountType?.id?.toString(),
            isActive: resourceData?.isActive,
            priority: resourceData?.priority || 1,
            displayOrder: resourceData?.displayOrder || 1
          });
          this.isLoading = false;
        },
        error: (error) => {
          LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load component', error);
          this.toaster?.show('Failed to load component details', 'error');
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const formValue = this.createForm.getRawValue();
    const payload = {
      ...formValue,
      discountTypeId: Number(formValue.discountTypeId)
    };

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating Concession Sub Type...' : 'Adding Concession Sub Type...';
    this.concessionComponentManagementService.saveConcessionComponent(this.routedId, payload)
      .subscribe({
        next: (response) => {
          const message = response?.body?.message || (this.isEditMode ? 'Updated successfully' : 'Created successfully');
          this.toaster?.show(message, 'success');
          setTimeout(() => {
            this.goToListing();
          }, 1500);
        },
        error: (error) => {
          LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Save failed', error);
          this.toaster?.show('Failed to save Concession Sub Type', 'error');
          this.isLoading = false;
        }
      });
  }

  goToListing(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.LIST);
  }

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
      maxlength: 'Code cannot exceed 15 characters.',
      whitespace: 'Code cannot be empty.'
    },
    name: {
      required: 'Name is required.',
      maxlength: 'Name cannot exceed 50 characters.',
      whitespace: 'Name cannot be empty or whitespace only.'
    },
    discountTypeId: {
      required: 'Concession Type is required.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.',
      whitespace: 'Description cannot be empty.'
    }
  };

  get code() { return this.createForm.get('code'); }
  get name() { return this.createForm.get('name'); }
  get discountTypeId() { return this.createForm.get('discountTypeId'); }
  get description() { return this.createForm.get('description'); }
  get isActive() { return this.createForm.get('isActive'); }
}
