import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionManagementService } from '../../services/concession-management.service';
import { ConcessionResponse } from '../../models/ConcessionResponse';
import { KeyValueOption } from '../../../fee-catalog-management/models/feeConfig';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';


@Component({
  selector: 'app-concession-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './concession-create-form.component.html',
  styleUrls: ['./concession-create-form.component.css']
})
export class ConcessionCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  isEditMode = false;
  concessionData?: ConcessionResponse;
  recurrenceRuleOptions: KeyValueOption[] = [];
  chargeTypeOptions: KeyValueOption[] = [];

  constructor(private fb: FormBuilder,
    private consessionManagementService: ConcessionManagementService,
    private feeCatalogManagementService: FeeCatalogManagementService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFeeCatalogMeta();

    this.initializeForm();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getConcessionDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
  }

  private getFeeCatalogMeta() {
    this.feeCatalogManagementService.getFeeCatalogMeta().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.recurrenceRuleOptions = Object.entries(response.body.recurrenceRules).map(
          ([key, label]) => ({ key, label: label as string })
        );

        this.chargeTypeOptions = Object.entries(response.body.chargeTypes).map(
          ([key, label]) => ({ key, label: label as string })
        );
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



  private initializeForm() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      code: ['', Validators.maxLength(20)],
      active: [true],
      chargeType: ['', Validators.required],
      recurrenceRule: ['', Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  goToConcessionList(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.LIST);
  }
  onSubmit(): void {
    console.log('✅ Campus Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.consessionManagementService.saveConcession(this.routedId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.LIST);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/Campuss']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }


  getConcessionDetails(concessionId: string): void {
    this.consessionManagementService.getConcessionById(concessionId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionData = response.body;
        console.log('📦 Campus data :', this.concessionData);
        this.createForm.patchValue(this.concessionData ?? {});
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }


  //getters
  get name() {
    return this.createForm.get('name');
  }

  get code() {
    return this.createForm.get('code');
  }

  get active() {
    return this.createForm.get('active');
  }

  get chargeType() {
    return this.createForm.get('chargeType');
  }

  get recurrenceRule() {
    return this.createForm.get('recurrenceRule');
  }

  get description() {
    return this.createForm.get('description');
  }

    getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) {
        return this.validationMessages[controlName][key];
      }
    }

    return '';
  }

  validationMessages = {
    name: {
      required: 'Name is required.',
      maxlength: 'Name cannot exceed 150 characters.',
      whitespace: 'Name cannot be empty or whitespace only.'
    },
    code: {
      maxlength: 'Code cannot exceed 20 characters.',
      pattern: 'Code can only contain uppercase letters, numbers, and underscores.',
      whitespace: 'Code cannot be empty or whitespace only.'
    },
    chargeType: {
      required: 'Charge Type is required.'
    },
    recurrenceRule: {
      required: 'Recurrence Rule is required.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.',
      whitespace: 'Description cannot be empty or whitespace only.'
    }
  };

}