import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdvanceDetailsComponent } from './employee-advance-details.component';

describe('EmployeeAdvanceDetailsComponent', () => {
  let component: EmployeeAdvanceDetailsComponent;
  let fixture: ComponentFixture<EmployeeAdvanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdvanceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAdvanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
