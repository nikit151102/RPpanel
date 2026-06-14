import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekSelectorModalComponent } from './week-selector-modal.component';

describe('WeekSelectorModalComponent', () => {
  let component: WeekSelectorModalComponent;
  let fixture: ComponentFixture<WeekSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekSelectorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
