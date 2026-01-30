import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMorePopComponent } from './show-more-pop.component';

describe('ShowMorePopComponent', () => {
  let component: ShowMorePopComponent;
  let fixture: ComponentFixture<ShowMorePopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMorePopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMorePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
