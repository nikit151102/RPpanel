import { TestBed } from '@angular/core/testing';

import { StorePlanService } from './store-plan.service';

describe('StorePlanService', () => {
  let service: StorePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
