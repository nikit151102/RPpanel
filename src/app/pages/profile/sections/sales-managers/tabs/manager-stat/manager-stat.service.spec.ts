import { TestBed } from '@angular/core/testing';

import { ManagerStatService } from './manager-stat.service';

describe('ManagerStatService', () => {
  let service: ManagerStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
