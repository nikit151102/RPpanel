import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsReportComponent } from './logistics-report.component';

describe('LogisticsReportComponent', () => {
  let component: LogisticsReportComponent;
  let fixture: ComponentFixture<LogisticsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
