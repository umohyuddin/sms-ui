import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentCreateComponent } from './salary-component-create.component';

describe('SalaryComponentCreateComponent', () => {
  let component: SalaryComponentCreateComponent;
  let fixture: ComponentFixture<SalaryComponentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryComponentCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryComponentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
