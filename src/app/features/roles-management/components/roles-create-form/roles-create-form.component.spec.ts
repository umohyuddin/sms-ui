import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesCreateFormComponent } from './roles-create-form.component';

describe('RolesCreateFormComponent', () => {
  let component: RolesCreateFormComponent;
  let fixture: ComponentFixture<RolesCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
