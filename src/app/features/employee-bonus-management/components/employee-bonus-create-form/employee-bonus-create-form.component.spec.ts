import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBonusCreateFormComponent } from './employee-bonus-create-form.component';

describe('EmployeeBonusCreateFormComponent', () => {
  let component: EmployeeBonusCreateFormComponent;
  let fixture: ComponentFixture<EmployeeBonusCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBonusCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeBonusCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
