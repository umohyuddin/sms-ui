import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdvanceCreateComponent } from './employee-advance-create.component';

describe('EmployeeAdvanceCreateComponent', () => {
  let component: EmployeeAdvanceCreateComponent;
  let fixture: ComponentFixture<EmployeeAdvanceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdvanceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAdvanceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
