import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDocumentGroupComponent } from './profile-document-group.component';

describe('ProfileDocumentGroupComponent', () => {
  let component: ProfileDocumentGroupComponent;
  let fixture: ComponentFixture<ProfileDocumentGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDocumentGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDocumentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
