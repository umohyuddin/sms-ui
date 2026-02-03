import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesInfoComponent } from './roles-info.component';

describe('RolesInfoComponent', () => {
  let component: RolesInfoComponent;
  let fixture: ComponentFixture<RolesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
