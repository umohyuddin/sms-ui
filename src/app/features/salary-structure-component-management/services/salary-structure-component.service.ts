import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable, of } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { SalaryStructureComponent } from '../models/SalaryStructureComponent';

@Injectable({
  providedIn: 'root'
})
export class SalaryStructureComponentService {

  private baseUrl = '';

  // Static data based on provided API response
  private salaryStructureComponents: SalaryStructureComponent[] = [
    {
      "id": 1,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 1,
      "componentName": "Basic Salary",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 50.00
    },
    {
      "id": 2,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 2,
      "componentName": "House Rent Allowance (HRA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 20.00
    },
    {
      "id": 3,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 3,
      "componentName": "Dearness Allowance (DA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 5000.00
    },
    {
      "id": 4,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 4,
      "componentName": "Conveyance Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 3000.00
    },
    {
      "id": 5,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 5,
      "componentName": "Medical Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 10.00
    },
    {
      "id": 6,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 6,
      "componentName": "Special Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 12.00
    },
    {
      "id": 7,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 7,
      "componentName": "Performance Bonus",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 5.00
    },
    {
      "id": 8,
      "salaryStructureId": 1,
      "salaryStructureName": null,
      "componentId": 8,
      "componentName": "Travel Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 200.00
    },
    {
      "id": 9,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 1,
      "componentName": "Basic Salary",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 40.00
    },
    {
      "id": 10,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 2,
      "componentName": "House Rent Allowance (HRA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 15.00
    },
    {
      "id": 11,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 3,
      "componentName": "Dearness Allowance (DA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 4000.00
    },
    {
      "id": 12,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 4,
      "componentName": "Conveyance Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 2000.00
    },
    {
      "id": 13,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 5,
      "componentName": "Medical Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 8.00
    },
    {
      "id": 14,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 6,
      "componentName": "Special Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 10.00
    },
    {
      "id": 15,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 7,
      "componentName": "Performance Bonus",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 4.00
    },
    {
      "id": 16,
      "salaryStructureId": 2,
      "salaryStructureName": null,
      "componentId": 8,
      "componentName": "Travel Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 150.00
    },
    {
      "id": 17,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 1,
      "componentName": "Basic Salary",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 60.00
    },
    {
      "id": 18,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 2,
      "componentName": "House Rent Allowance (HRA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 25.00
    },
    {
      "id": 19,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 3,
      "componentName": "Dearness Allowance (DA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 8000.00
    },
    {
      "id": 20,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 4,
      "componentName": "Conveyance Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 5000.00
    },
    {
      "id": 21,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 5,
      "componentName": "Medical Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 15.00
    },
    {
      "id": 22,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 6,
      "componentName": "Special Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 12.00
    },
    {
      "id": 23,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 7,
      "componentName": "Performance Bonus",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 6.00
    },
    {
      "id": 24,
      "salaryStructureId": 3,
      "salaryStructureName": null,
      "componentId": 8,
      "componentName": "Travel Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 300.00
    },
    {
      "id": 25,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 1,
      "componentName": "Basic Salary",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 35.00
    },
    {
      "id": 26,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 2,
      "componentName": "House Rent Allowance (HRA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 10.00
    },
    {
      "id": 27,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 3,
      "componentName": "Dearness Allowance (DA)",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 3000.00
    },
    {
      "id": 28,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 4,
      "componentName": "Conveyance Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 1500.00
    },
    {
      "id": 29,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 5,
      "componentName": "Medical Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 5.00
    },
    {
      "id": 30,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 6,
      "componentName": "Special Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 8.00
    },
    {
      "id": 31,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 7,
      "componentName": "Performance Bonus",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 3.00
    },
    {
      "id": 32,
      "salaryStructureId": 4,
      "salaryStructureName": null,
      "componentId": 8,
      "componentName": "Travel Allowance",
      "componentType": "EARNING",
      "isPercentage": null,
      "value": 100.00
    }
  ];

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getSalaryStructureComponentMeta(): Observable<any> {
    // For now, return static data. In real app, this would be an API call
    return of({ body: this.salaryStructureComponents });
  }

  getAllSalaryStructureComponents(): Observable<any> {
    // Return static data wrapped in response format
    return of({ body: this.salaryStructureComponents });
  }

  getSalaryStructureComponentById(id: number): Observable<any> {
    const component = this.salaryStructureComponents.find(c => c.id === id);
    return of({ body: component });
  }

  saveSalaryStructureComponent(id: number | null, payload: SalaryStructureComponent): Observable<any> {
    // For static data, this is a no-op. In real app, would make API call
    return of({ body: payload });
  }

  searchSalaryStructureComponents(query: string): Observable<any> {
    const filtered = this.salaryStructureComponents.filter(c =>
      c.componentName.toLowerCase().includes(query.toLowerCase()) ||
      c.salaryStructureId.toString().includes(query)
    );
    return of({ body: filtered });
  }

  getSalaryStructureComponentsByStructureId(structureId: number): Observable<any> {
    const filtered = this.salaryStructureComponents.filter(c => c.salaryStructureId === structureId);
    return of({ body: filtered });
  }
}
