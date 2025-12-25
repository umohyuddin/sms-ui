import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureCreateComponent } from './salary-structure-create.component';

describe('SalaryStructureCreateComponent', () => {
  let component: SalaryStructureCreateComponent;
  let fixture: ComponentFixture<SalaryStructureCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
