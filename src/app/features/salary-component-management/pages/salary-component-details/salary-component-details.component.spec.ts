import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentDetailsComponent } from './salary-component-details.component';

describe('SalaryComponentDetailsComponent', () => {
  let component: SalaryComponentDetailsComponent;
  let fixture: ComponentFixture<SalaryComponentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryComponentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryComponentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
