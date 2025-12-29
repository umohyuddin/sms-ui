import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable, of } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { EmployeeSalary } from '../models/EmployeeSalary';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalaryService {

  private baseUrl = '';

  // Static data based on provided API response
  private employeeSalaries: EmployeeSalary[] = [
    {
      "id": null,
      "salaryId": 1,
      "employeeId": 1,
      "employeeCode": "EMP001",
      "employeeName": "Uzair Anwar",
      "employeeType": null,
      "grossSalary": 100000.00,
      "totalDeductions": 15000.00,
      "netSalary": 85000.00,
      "effectiveDate": "2025-12-01",
      "salaryStructureId": null,
      "status": null,
      "createdAt": null,
      "updatedAt": null
    },
    {
      "id": null,
      "salaryId": 2,
      "employeeId": 2,
      "employeeCode": "EMP002",
      "employeeName": "Ayesha Khan",
      "employeeType": null,
      "grossSalary": 80000.00,
      "totalDeductions": 12000.00,
      "netSalary": 68000.00,
      "effectiveDate": "2025-12-01",
      "salaryStructureId": null,
      "status": null,
      "createdAt": null,
      "updatedAt": null
    },
    {
      "id": null,
      "salaryId": 3,
      "employeeId": 3,
      "employeeCode": "EMP003",
      "employeeName": "Ali Raza",
      "employeeType": null,
      "grossSalary": 95000.00,
      "totalDeductions": 14000.00,
      "netSalary": 81000.00,
      "effectiveDate": "2025-12-01",
      "salaryStructureId": null,
      "status": null,
      "createdAt": null,
      "updatedAt": null
    },
    {
      "id": null,
      "salaryId": 4,
      "employeeId": 4,
      "employeeCode": "EMP004",
      "employeeName": "Sana Javed",
      "employeeType": null,
      "grossSalary": 120000.00,
      "totalDeductions": 20000.00,
      "netSalary": 100000.00,
      "effectiveDate": "2025-12-01",
      "salaryStructureId": null,
      "status": null,
      "createdAt": null,
      "updatedAt": null
    },
    {
      "id": null,
      "salaryId": 5,
      "employeeId": 5,
      "employeeCode": "EMP005",
      "employeeName": "Hamza Shah",
      "employeeType": null,
      "grossSalary": 70000.00,
      "totalDeductions": 10000.00,
      "netSalary": 60000.00,
      "effectiveDate": "2025-12-01",
      "salaryStructureId": null,
      "status": null,
      "createdAt": null,
      "updatedAt": null
    }
  ];

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getEmployeeSalaryMeta(): Observable<any> {
    // For now, return static data. In real app, this would be an API call
    return of({ body: this.employeeSalaries });
  }

  getAllEmployeeSalaries(): Observable<any> {
    // Return static data wrapped in response format
    return of({ body: this.employeeSalaries });
  }

  getEmployeeSalaryById(id: number): Observable<any> {
    const salary = this.employeeSalaries.find(s => s.salaryId === id);
    return of({ body: salary });
  }

  saveEmployeeSalary(id: number | null, payload: EmployeeSalary): Observable<any> {
    // For static data, this is a no-op. In real app, would make API call
    return of({ body: payload });
  }

  searchEmployeeSalaries(query: string): Observable<any> {
    const filtered = this.employeeSalaries.filter(s =>
      s.employeeName.toLowerCase().includes(query.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(query.toLowerCase()) ||
      s.salaryId.toString().includes(query)
    );
    return of({ body: filtered });
  }
}
