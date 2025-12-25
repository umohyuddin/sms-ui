import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCreateComponent } from './designation-create.component';

describe('DesignationCreateComponent', () => {
  let component: DesignationCreateComponent;
  let fixture: ComponentFixture<DesignationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
