import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryModalComponent } from './user-summary-modal.component';

describe('UserSummaryModalComponent', () => {
  let component: UserSummaryModalComponent;
  let fixture: ComponentFixture<UserSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSummaryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
