import { TestBed } from '@angular/core/testing';

import { JobOpeningService } from './job-opening.service';

describe('JobOpeningService', () => {
  let service: JobOpeningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobOpeningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
