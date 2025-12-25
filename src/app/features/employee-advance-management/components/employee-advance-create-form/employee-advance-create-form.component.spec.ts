import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdvanceCreateFormComponent } from './employee-advance-create-form.component';

describe('EmployeeAdvanceCreateFormComponent', () => {
  let component: EmployeeAdvanceCreateFormComponent;
  let fixture: ComponentFixture<EmployeeAdvanceCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdvanceCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAdvanceCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
