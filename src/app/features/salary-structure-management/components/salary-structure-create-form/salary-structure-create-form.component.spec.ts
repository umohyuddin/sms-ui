import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureCreateFormComponent } from './salary-structure-create-form.component';

describe('SalaryStructureCreateFormComponent', () => {
  let component: SalaryStructureCreateFormComponent;
  let fixture: ComponentFixture<SalaryStructureCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
