import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardManagementService } from '../../services/standard-management.service';
import { StandardResponse } from '../../models/standardResponse';


@Component({
  selector: 'app-standard-create-form',
  standalone: true,
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './standard-create-form.component.html',
  styleUrls: ['./standard-create-form.component.css']
})
export class StandardCreateFormComponent {
  createStandardForm!: FormGroup;
  routestandardId?: string;
  URL = '';
  mode = '';
  standardData?: StandardResponse;
  campuses: CampusResponse[] = [];
  cities: any[] = [];
  standardId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

    this.getCampuses();
    this.initializeForm();
    this.standardId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.standardId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.standardId);
      this.getStandardDetails(this.standardId!);
    } else {
      console.log('Create Mode Activated');
    }
  }

  getStandardDetails(standardId: string): void {
    this.standardManagemenetService.getStandardById(standardId)
      .subscribe({
        next: (response) => {
          console.log('✅ Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.standardData = response.body;
          console.log('📦 Standard data :', this.standardData);
          this.createStandardForm.patchValue({
            standardName: this.standardData?.standardName,
            standardCode: this.standardData?.standardCode,
            description: this.standardData?.description,
            campusId: this.standardData?.campus?.id
          });
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

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campuses = response.body;
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
    this.createStandardForm = this.fb.group({
      standardName: ['', Validators.required],
      standardCode: [''],
      description: [''],
      campusId: ['', Validators.required]
    });
  }

  goTostandardList(): void {
    this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST);
  }
  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createStandardForm.getRawValue());
    if (this.createStandardForm.invalid) {
      this.createStandardForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    
    this.standardManagemenetService.saveStandard(this.standardId,this.createStandardForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      );
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/standards']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }

  //getters
  get standardName() {
    return this.createStandardForm.get('standardName');
  }

  get standardCode() {
    return this.createStandardForm.get('standardCode');
  }

  get description() {
    return this.createStandardForm.get('description');
  }

  get campusId() {
    return this.createStandardForm.get('campusId');
  }
}
