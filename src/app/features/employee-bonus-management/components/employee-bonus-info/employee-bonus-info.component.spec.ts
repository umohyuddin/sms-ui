import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBonusInfoComponent } from './employee-bonus-info.component';

describe('EmployeeBonusInfoComponent', () => {
  let component: EmployeeBonusInfoComponent;
  let fixture: ComponentFixture<EmployeeBonusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBonusInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeBonusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
