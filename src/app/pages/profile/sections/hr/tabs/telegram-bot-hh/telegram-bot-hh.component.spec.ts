import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramBotHHComponent } from './telegram-bot-hh.component';

describe('TelegramBotHHComponent', () => {
  let component: TelegramBotHHComponent;
  let fixture: ComponentFixture<TelegramBotHHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelegramBotHHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelegramBotHHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
