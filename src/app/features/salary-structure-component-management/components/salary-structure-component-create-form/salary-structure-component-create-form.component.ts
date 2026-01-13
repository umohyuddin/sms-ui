import { Component } from '@angular/core';
import { SalaryStructureResponse } from '../../../salary-structure-management/models/SalaryStructureResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryStructureService } from '../../../salary-structure-management/services/salary-structure.service';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { SalaryStructureComponentService } from '../../services/salary-structure-component.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SalaryComponentService } from '../../../salary-component-management/services/salary-component.service';
import { SalaryComponentResponse } from '../../../salary-component-management/models/SalaryComponent';

@Component({
  selector: 'app-salary-structure-component-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-structure-component-create-form.component.html',
  styleUrl: './salary-structure-component-create-form.component.css'
})
export class SalaryStructureComponentCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  isEditMode = false;

  salaryStructureResponse: SalaryStructureResponse[] = [];
  salaryComponents: SalaryComponentResponse[] = [];
  salaryStructureDD: KeyValueOption[] = [];
  selectedSalaryStructure: SalaryStructureResponse | null = null;

  private readonly MODULE = 'SalaryStructureMapping';
  private readonly COMPONENT = 'SalaryStructureMappingForm';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private salaryStructureService: SalaryStructureService,
    private salaryStructureMapping: SalaryStructureComponentService,
    private salaryComponentService: SalaryComponentService,
  ) { }

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();
    this.getSalaryStructures();
    this.getSalaryComponents();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode && this.routedId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Routed ID found', this.routedId);
      // this.getSalaryStructureDetails(this.routedId);
    }

    LoggerUtil.groupEnd(); // Close Init group
  }


  getSalaryComponents() {
    this.salaryComponentService.getAllSalaryComponents().subscribe({
      next: (response) => {
        console.log('Success Status:', response.status);
        console.log('Response Body:', response.body);
        this.salaryComponents = response.body;
        if (this.isEditMode && this.routedId) {
          this.getSalaryStructureDetails(this.routedId);
        }
      },
      error: (error) => {
        console.error('Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('Request Complete');
      }
    })
  }
  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);

    this.createForm = this.fb.group({
      salaryStructureId: ['', Validators.required],
      components: this.fb.array([])
    });

    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd();
  }



  private getSalaryStructures() {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Salary Structures`);
    this.salaryStructureService.getAllSalaryStructures().subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'SalaryStructures', '📦 Response Body', response.body);

        this.salaryStructureResponse = response.body;

        // Map response to KeyValueOption for dropdown
        this.salaryStructureDD = this.salaryStructureResponse.map(item => ({
          key: item.id.toString(),
          label: item.employeeTypeName
        }));

        LoggerUtil.log(this.MODULE, 'SalaryStructures', '✅ Dropdown mapped', this.salaryStructureDD);
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'SalaryStructures', '❌ Failed to load salary structures', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'SalaryStructures', '🔚 Salary structures request completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  getSalaryStructureDetails(id: string) {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Salary Structure Details`);
    this.salaryStructureService.getSalaryStructureByEmployeeType(id).subscribe({
      next: (response) => {
        const structure = response.body;
        LoggerUtil.log(this.MODULE, 'Details', '✅ Salary structure data loaded', response.body);
        this.createForm.patchValue({
          salaryStructureId: response.body?.id,
        });
        this.populateComponentsForEdit(structure.components);
      },

      error: (error) => LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load salary structure', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Details', '🔚 Salary structure details request completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  private populateComponentsForEdit(mappedComponents: any[]) {
    this.componentsFormArray.clear();

    this.salaryComponents.forEach(comp => {
      const mapped = mappedComponents.find(
        m => m.componentId === comp.id
      );

      const group = this.fb.group({
        componentId: [comp.id],
        componentName: [comp.name],
        isPercentage: [comp.isPercentage],
        selected: [!!mapped],
        value: [
          { value: mapped ? mapped.value : '', disabled: !mapped }
        ]
      });

      // Apply validators if selected
      if (mapped) {
        group.get('value')?.setValidators(
          comp.isPercentage
            ? [Validators.required, Validators.min(0), Validators.max(100)]
            : [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
        );
      }

      group.get('value')?.updateValueAndValidity();
      this.componentsFormArray.push(group);
    });
  }

  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', this.createForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form data', this.createForm.getRawValue());

    // ✅ Get form value once
    const formValue = this.createForm.getRawValue();

    // ✅ Only selected components
    formValue.components = formValue.components.filter(
      (c: any) => c.selected
    );

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting payload', formValue);


     const request$ = this.isEditMode && this.routedId
    ? this.salaryStructureMapping.updateSalaryComponentMapping(this.routedId,   formValue)
    : this.salaryStructureMapping.createSalaryComponentMapping(formValue);

request$.subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', response.body);
        LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to salary structure list');
        this.router.navigate(ROUTES.SALARY_STRUCTURE_COMPONENT.LIST); // adjust route as needed
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
        LoggerUtil.groupEnd();
      }
    });
  }


  onSalaryStructureChange() {
    // Clear previous selections
    const selectedId = this.createForm.get('salaryStructureId')?.value;

    // Find selected structure from dropdown list
    this.selectedSalaryStructure = this.salaryStructureResponse.find(s => s.id.toString() === selectedId) || null;
    this.componentsFormArray.clear();

    // Populate fresh checkboxes + input boxes
    this.salaryComponents.forEach(comp => {
      this.componentsFormArray.push(
        this.fb.group({
          componentId: [comp.id],
          componentName: [comp.name],
          isPercentage: [comp.isPercentage],
          selected: [false],
          value: [{ value: '', disabled: true }]

        })
      );
    });
  }
  // Getter for form controls
  get salaryStructureId() { return this.createForm.get('salaryStructureId'); }

  goToListing() {
    this.router.navigate(ROUTES.SALARY_STRUCTURE_COMPONENT.LIST);
  }

  onComponentToggle(index: number) {
    const componentGroup = this.componentsFormArray.at(index);
    const selected = componentGroup.get('selected')?.value;
    const isPercentage = componentGroup.get('isPercentage')?.value;
    const valueControl = componentGroup.get('value');

    if (selected) {
      // Enable input and set validators
      valueControl?.enable({ emitEvent: false });
      valueControl?.setValidators(isPercentage
        ? [Validators.required, Validators.min(0), Validators.max(100)]
        : [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
      );
    } else {
      // Disable input and clear value & validators
      valueControl?.setValue('');
      valueControl?.clearValidators();
      valueControl?.disable({ emitEvent: false });
    }

    valueControl?.updateValueAndValidity();
  }


  get componentsFormArray(): FormArray {
    return this.createForm.get('components') as FormArray;
  }


}
