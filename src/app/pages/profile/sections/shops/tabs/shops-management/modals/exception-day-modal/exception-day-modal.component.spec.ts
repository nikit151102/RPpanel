import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionDayModalComponent } from './exception-day-modal.component';

describe('ExceptionDayModalComponent', () => {
  let component: ExceptionDayModalComponent;
  let fixture: ComponentFixture<ExceptionDayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExceptionDayModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionDayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
