import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeManagementService } from '../../../employee-management/services/employee-management.service';
import { EmployeeResponse } from '../../../employee-management/models/EmployeeResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-employee-salary',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './assign-employee-salary.component.html',
  styleUrl: './assign-employee-salary.component.css'
})
export class AssignEmployeeSalaryComponent {

  employeeResponse: EmployeeResponse[] = [];
  employeeForm: FormGroup;

  constructor(
    private employeeManagementService: EmployeeManagementService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      employees: this.fb.array([])
    });
  }
  ngOnInit() {
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.employeeManagementService.getAllEmployee().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeResponse = response.body;
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

   initEmployeeForm() {
    this.employeeResponse.forEach(emp => {
      this.employeesFormArray.push(this.fb.group({
        id: [emp.id],
        fullName: [emp.fullName],
        email: [emp.email],
        selected: [false]  // Checkbox state
      }));
    });
  }

   onEmployeeToggle(index: number) {
    const emp = this.employeesFormArray.at(index).value;
    console.log('Toggled employee:', emp);
  }

    get employeesFormArray(): FormArray {
    return this.employeeForm.get('employees') as FormArray;
  }

}
