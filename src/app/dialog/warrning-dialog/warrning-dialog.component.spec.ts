import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrningDialogComponent } from './warrning-dialog.component';

describe('WarrningDialogComponent', () => {
  let component: WarrningDialogComponent;
  let fixture: ComponentFixture<WarrningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrningDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarrningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
