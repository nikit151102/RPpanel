import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsCheckModalComponent } from './limits-check-modal.component';

describe('LimitsCheckModalComponent', () => {
  let component: LimitsCheckModalComponent;
  let fixture: ComponentFixture<LimitsCheckModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitsCheckModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitsCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
