import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionCreateFormComponent } from './permission-create-form.component';

describe('PermissionCreateFormComponent', () => {
  let component: PermissionCreateFormComponent;
  let fixture: ComponentFixture<PermissionCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
