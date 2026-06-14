import { TestBed } from '@angular/core/testing';

import { LogisticsReportService } from './logistics-report.service';

describe('LogisticsReportService', () => {
  let service: LogisticsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
