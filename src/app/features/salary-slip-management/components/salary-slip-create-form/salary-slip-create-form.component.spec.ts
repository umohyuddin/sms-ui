import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipCreateFormComponent } from './salary-slip-create-form.component';

describe('SalarySlipCreateFormComponent', () => {
  let component: SalarySlipCreateFormComponent;
  let fixture: ComponentFixture<SalarySlipCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarySlipCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySlipCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
