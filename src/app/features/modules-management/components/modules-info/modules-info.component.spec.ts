import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesInfoComponent } from './modules-info.component';

describe('ModulesInfoComponent', () => {
  let component: ModulesInfoComponent;
  let fixture: ComponentFixture<ModulesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ModulesInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
