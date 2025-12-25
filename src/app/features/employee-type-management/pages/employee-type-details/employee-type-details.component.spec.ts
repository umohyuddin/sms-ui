import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeDetailsComponent } from './employee-type-details.component';

describe('EmployeeTypeDetailsComponent', () => {
  let component: EmployeeTypeDetailsComponent;
  let fixture: ComponentFixture<EmployeeTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
