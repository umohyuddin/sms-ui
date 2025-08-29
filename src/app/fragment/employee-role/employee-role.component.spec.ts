import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploeeRoleComponent } from './employee-role.component';

describe('EmploeeRoleComponent', () => {
  let component: EmploeeRoleComponent;
  let fixture: ComponentFixture<EmploeeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploeeRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploeeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
