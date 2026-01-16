import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDocumentListComponent } from './profile-document-list.component';

describe('ProfileDocumentListComponent', () => {
  let component: ProfileDocumentListComponent;
  let fixture: ComponentFixture<ProfileDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDocumentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
