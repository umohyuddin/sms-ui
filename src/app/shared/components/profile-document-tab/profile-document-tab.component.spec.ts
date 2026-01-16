import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDocumentTabComponent } from './profile-document-tab.component';

describe('ProfileDocumentTabComponent', () => {
  let component: ProfileDocumentTabComponent;
  let fixture: ComponentFixture<ProfileDocumentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDocumentTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDocumentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
