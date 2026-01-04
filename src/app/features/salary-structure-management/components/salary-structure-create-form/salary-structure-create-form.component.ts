import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalaryStructureResponse } from '../../models/SalaryStructureResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { SalaryStructureService } from '../../services/salary-structure.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-salary-structure-create-form',
  standalone: true,
  imports: [],
  templateUrl: './salary-structure-create-form.component.html',
  styleUrl: './salary-structure-create-form.component.css'
})
export class SalaryStructureCreateFormComponent {
createForm!: FormGroup;
  routedId?: string;
  URL = '';
  mode = '';
  responseData?: SalaryStructureResponse;
  campuses: KeyValueOption[] = [];
  isEditMode: boolean = false;

  constructor(
    private salaryStructureService: SalaryStructureService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

    //this.getCampuses();
    // this.initializeForm();
    // this.routedId = this.route.snapshot.paramMap.get('id');
    // this.isEditMode = !!this.routedId;

    // if (this.isEditMode) {
    //   console.log('Edit Mode Activated - Load data for:', this.routedId);
    //   this.getStandardDetails(this.routedId!);
    // } else {
    //   console.log('Create Mode Activated');
    // }
  }

  // getStandardDetails(standardId: string): void {
  //   this.salaryStructureService.getSalaryStructureById(standardId)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('  Request Success Status:', response.status);
  //         console.log('📦 Response Body:', response.body);
  //         this.responseData = response.body;
  //         console.log('📦 Standard data :', this.responseData);
  //         this.createForm.patchValue({
  //           standardName: this.responseData?.employeeTypeId,
  //           standardCode: this.responseData?.standardCode,
  //           description: this.responseData?.description,
  //           campusId: this.responseData?.campus?.id
  //         });
  //       },
  //       error: (error) => {
  //         console.error('❌ Request Error Status:', error.status);
  //         console.error('Message:', error.message);
  //       },
  //       complete: () => {
  //         console.log('🔚 Request Complete');
  //       }
  //     })
  // }

  // private getCampuses() {
  //   this.campusManagementService.getAllCampuses().subscribe({
  //     next: (response) => {
  //       console.log('  Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.campuses = response.body;
  //     },
  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   });
  // }

  // private initializeForm() {
  //   this.createStandardForm = this.fb.group({
  //     standardName: ['', Validators.required],
  //     standardCode: [''],
  //     description: [''],
  //     campusId: ['', Validators.required]
  //   });
  // }

  // goTostandardList(): void {
  //   this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST);
  // }
  // onSubmit(): void {
  //   console.log('  Create standard Form Data:', this.createStandardForm.getRawValue());
  //   if (this.createStandardForm.invalid) {
  //     this.createStandardForm.markAllAsTouched();
  //     console.warn('❌ Form is invalid');
  //     return;
  //   }
    
  //   this.standardManagemenetService.saveStandard(this.standardId,this.createStandardForm.getRawValue()).subscribe({
  //     next: (response) => {
  //       console.log('  Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      );
  //     },
  //     error: (error) => {
  //       console.error('❌ Post Error Status:', error.status);
  //       console.error('Message:', error.message);
  //       this.router.navigate(['/standards']);
  //     },
  //     complete: () => {
  //       console.log('🔚 Post Complete');
  //     }
  //   })
  // }

  //getters
  // get standardName() {
  //   return this.createStandardForm.get('standardName');
  // }

  // get standardCode() {
  //   return this.createStandardForm.get('standardCode');
  // }

  // get description() {
  //   return this.createStandardForm.get('description');
  // }

  // get campusId() {
  //   return this.createStandardForm.get('campusId');
  // }
}
