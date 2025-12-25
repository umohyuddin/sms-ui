import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCreateFormComponent } from './designation-create-form.component';

describe('DesignationCreateFormComponent', () => {
  let component: DesignationCreateFormComponent;
  let fixture: ComponentFixture<DesignationCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
