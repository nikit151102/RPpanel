import { TestBed } from '@angular/core/testing';

import { RolesManagementService } from './roles-management.service';

describe('RolesManagementService', () => {
  let service: RolesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
