import { TestBed } from '@angular/core/testing';

import { MonthlyPlansServiceService } from './monthly-plans-service.service';

describe('MonthlyPlansServiceService', () => {
  let service: MonthlyPlansServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyPlansServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
