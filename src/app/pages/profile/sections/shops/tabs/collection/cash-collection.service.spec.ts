import { TestBed } from '@angular/core/testing';

import { CashCollectionService } from './cash-collection.service';

describe('CashCollectionService', () => {
  let service: CashCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
