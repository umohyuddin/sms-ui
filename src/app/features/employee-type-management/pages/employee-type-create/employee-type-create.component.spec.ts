import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeCreateComponent } from './employee-type-create.component';

describe('EmployeeTypeCreateComponent', () => {
  let component: EmployeeTypeCreateComponent;
  let fixture: ComponentFixture<EmployeeTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
