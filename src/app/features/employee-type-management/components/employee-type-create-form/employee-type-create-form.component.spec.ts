import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeCreateFormComponent } from './employee-type-create-form.component';

describe('EmployeeTypeCreateFormComponent', () => {
  let component: EmployeeTypeCreateFormComponent;
  let fixture: ComponentFixture<EmployeeTypeCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
