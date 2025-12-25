import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureComponentCreateFormComponent } from './salary-structure-component-create-form.component';

describe('SalaryStructureComponentCreateFormComponent', () => {
  let component: SalaryStructureComponentCreateFormComponent;
  let fixture: ComponentFixture<SalaryStructureComponentCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureComponentCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureComponentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
