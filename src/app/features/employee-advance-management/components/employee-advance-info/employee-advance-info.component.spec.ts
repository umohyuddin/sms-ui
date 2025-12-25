import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdvanceInfoComponent } from './employee-advance-info.component';

describe('EmployeeAdvanceInfoComponent', () => {
  let component: EmployeeAdvanceInfoComponent;
  let fixture: ComponentFixture<EmployeeAdvanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdvanceInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAdvanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
