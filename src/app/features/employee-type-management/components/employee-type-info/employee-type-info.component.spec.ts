import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeInfoComponent } from './employee-type-info.component';

describe('EmployeeTypeInfoComponent', () => {
  let component: EmployeeTypeInfoComponent;
  let fixture: ComponentFixture<EmployeeTypeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
