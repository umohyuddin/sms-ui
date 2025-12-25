import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipInfoComponent } from './salary-slip-info.component';

describe('SalarySlipInfoComponent', () => {
  let component: SalarySlipInfoComponent;
  let fixture: ComponentFixture<SalarySlipInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarySlipInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySlipInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
