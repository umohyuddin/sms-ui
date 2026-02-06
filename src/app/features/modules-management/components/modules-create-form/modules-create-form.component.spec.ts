import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesCreateFormComponent } from './modules-create-form.component';

describe('ModulesCreateFormComponent', () => {
  let component: ModulesCreateFormComponent;
  let fixture: ComponentFixture<ModulesCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ModulesCreateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulesCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
