import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusProfileComponent } from './campus-profile.component';

describe('CampusProfileComponent', () => {
  let component: CampusProfileComponent;
  let fixture: ComponentFixture<CampusProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
