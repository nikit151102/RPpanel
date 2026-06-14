import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryStatusModalComponent } from './history-status-modal.component';

describe('HistoryStatusModalComponent', () => {
  let component: HistoryStatusModalComponent;
  let fixture: ComponentFixture<HistoryStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
