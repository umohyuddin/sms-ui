import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAddressComponent } from './employee-address.component';

describe('EmployeeAddressComponent', () => {
  let component: EmployeeAddressComponent;
  let fixture: ComponentFixture<EmployeeAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
