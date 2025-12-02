import { Component, Input, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';


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
  standardData: any;
  campuses: CampusResponse[] = [];
  cities: any[] = [];

  constructor(
    private campusManagementService: CampusManagementService,
    private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

    this.getCampuses();
    this.initializeForm();
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

    // Navigate to the create standard page
    this.router.navigate(['/standards']);
    //window.location.href = '/standards'; // Adjust the URL as needed
  }
  onSubmit(): void {
    console.log('✅ standard Form Data:', this.createStandardForm.getRawValue());
    if (this.createStandardForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createStandardForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    let requestMethod: string;
    let requestUrl: string;

    if (this.mode === 'create') {
      requestMethod = HTTP_METHOD.POST;
      requestUrl = this.URL;
    } else {
      requestMethod = HTTP_METHOD.PATCH;
      requestUrl = `${this.URL}/${this.routestandardId}`;
    }


    console.log('✅ standard Form Data:', this.createStandardForm.getRawValue());
    this.httpClientService.request<any>(requestMethod, requestUrl, {
      observeResponse: true,
      body: this.createStandardForm.getRawValue()
    }).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(['/standards']);
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



  getstandardDetails(standardId: string): void {

    const url = `${this.URL}/${standardId}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.standardData = response.body;
          console.log('standard Details:', this.standardData);
          this.createStandardForm.patchValue(this.standardData);
        },
        error: (error) => {
          console.error('❌ Error Status:', error.status);
          console.error('Message:', error.message);
        }
      });
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
