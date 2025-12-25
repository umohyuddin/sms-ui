import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBonusDetailsComponent } from './employee-bonus-details.component';

describe('EmployeeBonusDetailsComponent', () => {
  let component: EmployeeBonusDetailsComponent;
  let fixture: ComponentFixture<EmployeeBonusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBonusDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeBonusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
