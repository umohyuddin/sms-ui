import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipDetailsComponent } from './salary-slip-details.component';

describe('SalarySlipDetailsComponent', () => {
  let component: SalarySlipDetailsComponent;
  let fixture: ComponentFixture<SalarySlipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarySlipDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySlipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
